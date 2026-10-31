#!/bin/sh

DB_HOST=${POSTGRES_HOST:-postgres}
DB_PORT=${POSTGRES_PORT:-5432}

echo "Waiting for PostgreSQL ($DB_HOST:$DB_PORT)..."
until python -c "import socket; s=socket.socket(); s.settimeout(1); s.connect(('$DB_HOST', int('$DB_PORT'))); s.close()" 2>/dev/null; do
  sleep 1
done
echo "PostgreSQL is ready!"

R_HOST=${REDIS_HOST:-redis}
R_PORT=${REDIS_PORT:-6379}

echo "Waiting for Redis ($R_HOST:$R_PORT)..."
until python -c "import socket; s=socket.socket(); s.settimeout(1); s.connect(('$R_HOST', int('$R_PORT'))); s.close()" 2>/dev/null; do
  sleep 1
done
echo "Redis is ready!"

python manage.py makemigrations messaging
python manage.py migrate --noinput

echo "Starting chat_service with Daphne ASGI on port 8005..."
exec daphne -b 0.0.0.0 -p 8005 chat_service.asgi:application

