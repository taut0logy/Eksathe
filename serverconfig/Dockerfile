# Build Image
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json vite.config.js tailwind.config.js postcss.config.js jsconfig.json ./
COPY resources/ resources/

RUN npm install

RUN npm run build


# Production Image
FROM php:8.2-fpm-bullseye

WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    nano \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    curl \
    supervisor \
    && docker-php-ext-install pdo_mysql mbstring zip gd sockets pcntl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy built assets from the build stage
COPY --from=build /app/public/build public/build

# Set permissions and copy supervisor config
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache public \
    && cp serverconfig/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Optimize Laravel (only if .env exists, which it might not during build)
RUN if [ -f .env ]; then \
        php artisan config:cache && \
        php artisan route:cache && \
        php artisan view:cache && \
        php artisan optimize; \
    fi

# Create storage link
RUN php artisan storage:link || true

EXPOSE 9000 8080

# Start supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
