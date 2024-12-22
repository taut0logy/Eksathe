FROM node:18-alpine as build

WORKDIR /var/www/html

# Copy only package files first to leverage cache
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy environment file
RUN cp .env.example .env

# Update environment variables

COPY ./serverconfig/env-script.sh /usr/local/bin/env-script.sh

RUN chmod +x /usr/local/bin/env-script.sh

RUN /usr/local/bin/env-script.sh

# Build the assets
RUN npm run build

# Production stage
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

# Set working directory
WORKDIR /var/www/html

# Copy application code
COPY . .

# Copy built assets from build stage
COPY --from=build /var/www/html/public/build public/build

# copy environment file
RUN cp .env.example .env

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache public

# Copy nginx configuration
COPY ./serverconfig/nginx.conf /etc/nginx/sites-available/default

# Copy Supervisor configuration
COPY ./serverconfig/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy script to set environment variables
COPY ./serverconfig/entrypoint.sh /usr/local/bin/entrypoint.sh

# Make script executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port 80, 8080
EXPOSE 80

EXPOSE 8080

# Start Entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
