# Dockerfile — convite aniversário Mauricio 29
# Site estático: index.html + styles.css + script.js

# ---- Estágio 1: artefatos do site ----
# Stage vazio serve apenas como "fonte" de COPY --from, mantendo o Dockerfile
# preparado caso você queira adicionar um bundler (Vite/Astro/etc.) no futuro.
FROM alpine:3.20 AS build
WORKDIR /src
COPY index.html styles.css script.js ./

# ---- Estágio 2: runtime — nginx alpine servindo arquivos estáticos ----
FROM nginx:1.27-alpine

# nginx.conf enxuto: gzip + cache pra assets versionados + healthcheck + SPA fallback
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen       80;
    server_name  _;
    root         /usr/share/nginx/html;
    index        index.html;

    # gzip pra reduzir HTML/CSS/JS no fio
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    # arquivos versionados (CSS/JS/fonts): cache de 1 ano
    location ~* \.(?:css|js|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # raiz: serve o arquivo; fallback pro index se você adicionar rotas (#/deep-link)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # saúde do container (docker compose / k8s liveness)
    location = /healthz {
        access_log off;
        return 200 "ok\n";
        add_header Content-Type text/plain;
    }
}
EOF

# copia os arquivos do site vindos do estágio de build
COPY --from=build /src/ /usr/share/nginx/html/

# expõe 80 e declara healthcheck simples
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1/healthz || exit 1

# roda nginx em foreground (PID 1)
CMD ["nginx", "-g", "daemon off;"]
