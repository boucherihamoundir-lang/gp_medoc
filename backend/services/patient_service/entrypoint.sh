#!/bin/sh

echo "Waiting for PostgreSQL ($POSTGRES_HOST:$POSTGRES_PORT)..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.5
done
echo "PostgreSQL is ready!"

python manage.py makemigrations patients
python manage.py migrate --noinput

echo "Starting patient_service on port 8003..."
exec gunicorn patient_service.wsgi:application --bind 0.0.0.0:8003 --workers 3
