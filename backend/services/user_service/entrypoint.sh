#!/bin/sh

DB_HOST=${POSTGRES_HOST:-postgres}
DB_PORT=${POSTGRES_PORT:-5432}

echo "Waiting for PostgreSQL ($DB_HOST:$DB_PORT)..."
until python -c "import socket; s=socket.socket(); s.settimeout(1); s.connect(('$DB_HOST', int('$DB_PORT'))); s.close()" 2>/dev/null; do
  sleep 1
done
echo "PostgreSQL is ready!"

python manage.py makemigrations accounts
python manage.py migrate --noinput

echo "Starting user_service on port 8001..."
exec gunicorn user_service.wsgi:application --bind 0.0.0.0:8001 --workers 3

