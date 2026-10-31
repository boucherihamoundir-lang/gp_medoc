#!/bin/sh

echo "Waiting for PostgreSQL ($POSTGRES_HOST:$POSTGRES_PORT)..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.5
done
echo "PostgreSQL is ready!"

echo "Waiting for Redis ($REDIS_HOST:$REDIS_PORT)..."
while ! nc -z $REDIS_HOST $REDIS_PORT; do
  sleep 0.5
done
echo "Redis is ready!"

python manage.py makemigrations messaging
python manage.py migrate --noinput

echo "Starting chat_service with Daphne ASGI on port 8005..."
exec daphne -b 0.0.0.0 -p 8005 chat_service.asgi:application
