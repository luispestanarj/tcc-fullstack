#!/bin/sh
set -e

echo "⏳ Aplicando migrations..."
npx prisma migrate deploy

echo "🌱 Populando banco de dados..."
npx tsx prisma/seed.ts

echo "🚀 Iniciando API..."
exec node dist/server.js
