# ── Estágio 1: Build ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

RUN npm install --ignore-scripts

COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

# Compilar @tcc/shared (necessário para o alias do Vite)
RUN npm run build --workspace=packages/shared

# Build do React (Vite) → apps/web/dist/
RUN npm run build --workspace=apps/web

# ── Estágio 2: Produção (nginx) ───────────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
