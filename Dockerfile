FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    nano \
    nginx \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    redis-server \
    supervisor \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql zip gd sockets pcntl

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs build-essential

# Install NPM
RUN npm install -g npm \
    && npm install

# Set working directory
WORKDIR /var/www/html

# Copy application code
COPY . .

# copy environment file
RUN cp .env.example .env

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions and copy configuration files
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache public \
    && cp serverconfig/nginx.conf /etc/nginx/sites-available/default \
    && cp serverconfig/supervisord.conf /etc/supervisor/conf.d/supervisord.conf \
    && cp serverconfig/entrypoint.sh /usr/local/bin/entrypoint.sh

# Make script executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port 80, 8080
EXPOSE 80

EXPOSE 8080

# Start Entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
