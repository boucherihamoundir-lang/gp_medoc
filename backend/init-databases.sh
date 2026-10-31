#!/bin/bash
set -e

# Initialisation des 6 bases de données distinctes pour chaque microservice
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE medoc_users_db;
    CREATE DATABASE medoc_doctors_db;
    CREATE DATABASE medoc_patients_db;
    CREATE DATABASE medoc_appointments_db;
    CREATE DATABASE medoc_chats_db;
    CREATE DATABASE medoc_prescriptions_db;
EOSQL
