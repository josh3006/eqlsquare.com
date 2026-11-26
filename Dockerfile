FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY assets /usr/share/nginx/html/assets
COPY bubble-bee /usr/share/nginx/html/bubble-bee
COPY puzzle-game/app /usr/share/nginx/html/trickmind

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz | grep -q ok
