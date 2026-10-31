#!/bin/sh

DB_HOST=${POSTGRES_HOST:-postgres}
DB_PORT=${POSTGRES_PORT:-5432}

echo "Waiting for PostgreSQL ($DB_HOST:$DB_PORT)..."
until python -c "import socket; s=socket.socket(); s.settimeout(1); s.connect(('$DB_HOST', int('$DB_PORT'))); s.close()" 2>/dev/null; do
  sleep 1
done
echo "PostgreSQL is ready!"

python manage.py makemigrations patients
python manage.py migrate --noinput

echo "Starting patient_service on port 8003..."
exec gunicorn patient_service.wsgi:application --bind 0.0.0.0:8003 --workers 3

