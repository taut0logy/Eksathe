# Dockerfile for Laravel with React and Reverb server
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    nano \
    curl \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libsocket-dev \
    redis-server
    supervisor \
    && docker-php-ext-install pdo pdo_mysql zip gd sockets pcntl

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

# Set working directory
WORKDIR /var/www/html

# Copy application code
COPY . .

# copy environment file
RUN cp .env.example .env

RUN composer require laravel/reverb predis/predis

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Build React frontend
RUN npm install && npm run build

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Copy Supervisor configuration
COPY ./serverconfig/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy entrypoint script
COPY ./serverconfig/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Make entrypoint script executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Run Supervisor to manage PHP-FPM and Reverb server
# CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]

# Run entrypoint script
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

