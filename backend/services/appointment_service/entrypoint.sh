#!/bin/sh

echo "Waiting for PostgreSQL ($POSTGRES_HOST:$POSTGRES_PORT)..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.5
done
echo "PostgreSQL is ready!"

python manage.py makemigrations appointments
python manage.py migrate --noinput

echo "Starting appointment_service on port 8004..."
exec gunicorn appointment_service.wsgi:application --bind 0.0.0.0:8004 --workers 3
