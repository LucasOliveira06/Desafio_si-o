#!/bin/sh
# entrypoint.sh — Aguarda o PostgreSQL, popula todas as tabelas e inicia a API.
# Pode ser usado como Docker ENTRYPOINT ou executado diretamente no host.
#
# Uso no host (dentro de backend/):
#   chmod +x entrypoint.sh
#   ./entrypoint.sh
#
# Uso como Docker ENTRYPOINT:
#   ENTRYPOINT ["sh", "entrypoint.sh"]

set -e

# ── Carrega variáveis do .env se existir ─────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$SCRIPT_DIR/.env"
  set +a
  echo "✅ Variáveis carregadas de .env"
fi

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
MAX_RETRIES=30

# ── Aguarda o PostgreSQL responder ───────────────────────────────────────────
echo ""
echo "⏳ Aguardando PostgreSQL em ${DB_HOST}:${DB_PORT}..."

i=0
while ! nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
  i=$((i + 1))
  if [ "$i" -gt "$MAX_RETRIES" ]; then
    echo "❌ Timeout: PostgreSQL não respondeu após ${MAX_RETRIES} tentativas."
    echo "   Verifique se o banco está em execução e se DB_HOST/DB_PORT estão corretos."
    exit 1
  fi
  echo "   Tentativa ${i}/${MAX_RETRIES} — aguardando 2s..."
  sleep 2
done

echo "✅ PostgreSQL disponível!"
echo ""

# ── Executa o seed (popula cartorios, usuarios e imoveis) ────────────────────
echo "🌱 Populando todas as tabelas (cartorios, usuarios, imoveis)..."
echo ""
npm run seed
echo ""
echo "✅ Todas as tabelas foram populadas com sucesso!"
echo ""

# ── Inicia a API (opcional — remova as linhas abaixo se só quiser o seed) ────
if [ "${START_API:-true}" = "true" ]; then
  echo "🚀 Iniciando a API..."
  exec node dist/main
fi
