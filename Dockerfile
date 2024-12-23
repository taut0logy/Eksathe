FROM php:8.2-fpm

ARG APP_KEY
ARG APP_ENV
ARG APP_DEBUG
ARG APP_URL
ARG DB_HOST
ARG DB_PORT
ARG DB_DATABASE
ARG DB_USERNAME
ARG DB_PASSWORD
ARG MAIL_MAILER
ARG MAIL_HOST
ARG MAIL_PORT
ARG MAIL_USERNAME
ARG MAIL_PASSWORD
ARG MAIL_ENCRYPTION
ARG MAIL_FROM_ADDRESS
ARG REVERB_APP_KEY
ARG REVERB_APP_SECRET
ARG REVERB_HOST
ARG REVERB_PORT
ARG REVERB_SERVER_PORT

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
RUN npm install -g npm

# Set working directory
WORKDIR /var/www/html

# Copy application code
COPY . .

# copy environment file
RUN cp .env.example .env && \
    sed -i "s|APP_KEY=.*|APP_KEY=${APP_KEY}|g" .env && \
    sed -i "s|APP_ENV=.*|APP_ENV=${APP_ENV}|g" .env && \
    sed -i "s|APP_DEBUG=.*|APP_DEBUG=${APP_DEBUG}|g" .env && \
    sed -i "s|APP_URL=.*|APP_URL=${APP_URL}|g" .env && \
    sed -i "s|DB_HOST=.*|DB_HOST=${DB_HOST}|g" .env && \
    sed -i "s|DB_PORT=.*|DB_PORT=${DB_PORT}|g" .env && \
    sed -i "s|DB_DATABASE=.*|DB_DATABASE=${DB_DATABASE}|g" .env && \
    sed -i "s|DB_USERNAME=.*|DB_USERNAME=${DB_USERNAME}|g" .env && \
    sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=${DB_PASSWORD}|g" .env && \
    sed -i "s|MAIL_MAILER=.*|MAIL_MAILER=${MAIL_MAILER}|g" .env && \
    sed -i "s|MAIL_HOST=.*|MAIL_HOST=${MAIL_HOST}|g" .env && \
    sed -i "s|MAIL_PORT=.*|MAIL_PORT=${MAIL_PORT}|g" .env && \
    sed -i "s|MAIL_USERNAME=.*|MAIL_USERNAME=${MAIL_USERNAME}|g" .env && \
    sed -i "s|MAIL_PASSWORD=.*|MAIL_PASSWORD=${MAIL_PASSWORD}|g" .env && \
    sed -i "s|MAIL_ENCRYPTION=.*|MAIL_ENCRYPTION=${MAIL_ENCRYPTION}|g" .env && \
    sed -i "s|MAIL_FROM_ADDRESS=.*|MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS}|g" .env && \
    sed -i "s|REVERB_APP_KEY=.*|REVERB_APP_KEY=${REVERB_APP_KEY}|g" .env && \
    sed -i "s|REVERB_APP_SECRET=.*|REVERB_APP_SECRET=${REVERB_APP_SECRET}|g" .env && \
    sed -i "s|REVERB_HOST=.*|REVERB_HOST=${REVERB_HOST}|g" .env && \
    sed -i "s|REVERB_PORT=.*|REVERB_PORT=${REVERB_PORT}|g" .env && \
    sed -i "s|REVERB_SERVER_PORT=.*|REVERB_SERVER_PORT=${REVERB_SERVER_PORT}|g" .env

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Build assets
RUN npm install \
    && npm run build

# Clear node_modules
RUN rm -rf node_modules

# Set permissions and copy configuration files
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache public \
    && cp serverconfig/nginx.conf /etc/nginx/sites-available/default \
    && cp serverconfig/supervisord.conf /etc/supervisor/conf.d/supervisord.conf \
    && cp serverconfig/entrypoint.sh /usr/local/bin/entrypoint.sh

# Cache Laravel configuration and optimize
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan optimize && \
    php artisan storage:link

# Expose port 80, 8080
EXPOSE 80

EXPOSE 8080

# Start supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
