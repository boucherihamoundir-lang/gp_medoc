#!/bin/sh

echo "Waiting for PostgreSQL ($POSTGRES_HOST:$POSTGRES_PORT)..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.5
done
echo "PostgreSQL is ready!"

python manage.py makemigrations accounts
python manage.py migrate --noinput

echo "Starting user_service on port 8001..."
exec gunicorn user_service.wsgi:application --bind 0.0.0.0:8001 --workers 3
