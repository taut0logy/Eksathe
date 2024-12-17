FROM nginx:latest

# Copy custom nginx configuration
COPY ./serverconfig/nginx.conf /etc/nginx/conf.d/default.conf

# Copy application files
COPY . /var/www/html

# Ensure correct permissions
RUN chown -R nginx:nginx /var/www/html

# Expose port 80
EXPOSE 80
