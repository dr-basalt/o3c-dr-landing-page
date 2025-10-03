# Simple Nginx image to serve the static landing page
# syntax=docker/dockerfile:1

FROM nginx:1.25-alpine

# Remove default config and use our own
RUN rm -f /etc/nginx/conf.d/default.conf
ARG TWENTY_API_KEY
ENV TWENTY_API_KEY=${TWENTY_API_KEY}
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy static assets
# Ensure env vars get rendered into template at runtime
# nginx:alpine images run /docker-entrypoint.d scripts to render templates in /etc/nginx/templates

COPY . /usr/share/nginx/html

# Ensure proper permissions
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
