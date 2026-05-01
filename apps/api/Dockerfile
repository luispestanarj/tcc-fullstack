FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar manifestos de workspace para aproveitar cache de camadas
COPY package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# Instalar todas as dependências (inclui tsx e Prisma CLI no devDeps)
RUN npm install

# Copiar código-fonte
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# 1. Compilar @tcc/shared → dist/
RUN npm run build --workspace=packages/shared

# 2. Gerar Prisma Client
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

# 3. Compilar API TypeScript → dist/
RUN npm run build --workspace=apps/api

WORKDIR /app/apps/api

ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts && exec node dist/server.js"]
