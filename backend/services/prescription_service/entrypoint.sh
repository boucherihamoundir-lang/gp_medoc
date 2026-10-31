#!/bin/sh

echo "Waiting for PostgreSQL ($POSTGRES_HOST:$POSTGRES_PORT)..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.5
done
echo "PostgreSQL is ready!"

python manage.py makemigrations documents
python manage.py migrate --noinput

echo "Starting prescription_service on port 8006..."
exec gunicorn prescription_service.wsgi:application --bind 0.0.0.0:8006 --workers 3
