#!/bin/sh

echo "Waiting for PostgreSQL ($POSTGRES_HOST:$POSTGRES_PORT)..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.5
done
echo "PostgreSQL is ready!"

python manage.py makemigrations doctors
python manage.py migrate --noinput

echo "Starting doctor_service on port 8002..."
exec gunicorn doctor_service.wsgi:application --bind 0.0.0.0:8002 --workers 3
