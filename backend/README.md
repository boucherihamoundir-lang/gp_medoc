# MEDOC - Architecture Backend en 6 Microservices Django

Cette infrastructure découpe l'ensemble du portail médical **MEDOC** en 6 microservices indépendants conteneurisés avec **Docker Compose**, orchestrés par une **API Gateway Nginx** unique et propulsés par **PostgreSQL** et **Redis**.

---

## 🏗️ Vue d'Ensemble de l'Architecture

| Service | Port Interne | Base de Données | Rôle Principal |
|---|---|---|---|
| **API Gateway (Nginx)** | `80` (Hôte : `8000`) | - | Point d'entrée unique, routage, CORS, WebSockets proxy |
| **`user_service`** | `8001` | `medoc_users_db` | Auth JWT, inscription, séparation des rôles (`doctor` vs `patient`) |
| **`doctor_service`** | `8002` | `medoc_doctors_db` | Annuaire, profils praticiens, spécialités, wilayas, tarifs |
| **`patient_service`** | `8003` | `medoc_patients_db` | Dossier Médical Partagé (DMP), groupe sanguin, urgences |
| **`appointment_service`** | `8004` | `medoc_appointments_db`| Prise de RDV, planning médecin, statuts de consultation |
| **`chat_service`** | `8005` | `medoc_chats_db` | Messagerie temps réel (Django Channels + Redis WebSockets) |
| **`prescription_service`**| `8006` | `medoc_prescriptions_db`| Ordonnances numériques, certificats d'aptitude, export PDF |

---

## 🚀 Démarrage Rapide

### 1. Prérequis
- **Docker Desktop** installé et démarré sur votre machine.

### 2. Lancer tous les services
Dans le terminal, rendez-vous dans le dossier `backend` :

```bash
cd backend
docker compose up --build
```

Docker va automatiquement :
1. Démarrer le conteneur **PostgreSQL 16** et exécuter le script `init-databases.sh` pour créer les 6 bases de données.
2. Démarrer le broker **Redis 7** pour les WebSockets.
3. Construire et lancer les **6 conteneurs Django**.
4. Appliquer automatiquement toutes les migrations (`makemigrations` et `migrate`).
5. Démarrer l'**API Gateway Nginx** sur le port `8000`.

---

## 🌐 Endpoints via l'API Gateway (`http://localhost:8000`)

### 1. Auth & Users (`/api/v1/auth/`)
- `POST /api/v1/auth/register/` : Inscription (`doctor` ou `patient`)
- `POST /api/v1/auth/login/` : Connexion (Retourne access + refresh tokens JWT + profil)
- `GET /api/v1/auth/profile/` : Profil de l'utilisateur connecté
- `GET /api/v1/auth/users/?role=doctor` : Liste filtrée par rôle

### 2. Praticiens (`/api/v1/doctors/`)
- `GET /api/v1/doctors/` : Annuaire public (recherche par `specialty`, `wilaya`, `q`)
- `GET /api/v1/doctors/<id>/` : Fiche détaillée d'un médecin
- `GET/PUT /api/v1/doctors/profile/` : Gestion du profil praticien connecté

### 3. Patients (`/api/v1/patients/`)
- `GET/PUT /api/v1/patients/profile/` : Dossier médical personnel (groupe sanguin, biométrie)
- `GET /api/v1/patients/list/` : Annuaire des patients (réservé aux praticiens)
- `GET/POST /api/v1/patients/documents/` : Documents médicaux téléversés

### 4. Rendez-vous (`/api/v1/appointments/`)
- `GET /api/v1/appointments/` : Liste des RDV de l'utilisateur
- `POST /api/v1/appointments/` : Prise de rendez-vous en ligne
- `PATCH /api/v1/appointments/<id>/status/` : Mise à jour du statut (`waiting`, `completed`, `cancelled`)

### 5. Chat & Messagerie Temps Réel (`/api/v1/chats/` & `/ws/`)
- `GET /api/v1/chats/` : Salons de discussion actifs
- `GET /api/v1/chats/<room_name>/messages/` : Historique des messages
- `ws://localhost:8000/ws/chat/<room_name>/` : Flux WebSocket bidirectionnel instantané

### 6. Ordonnances & Documents Médicaux (`/api/v1/prescriptions/`)
- `GET /api/v1/prescriptions/` : Liste des ordonnances
- `POST /api/v1/prescriptions/` : Génération d'une ordonnance avec médicaments
- `GET /api/v1/prescriptions/<id>/pdf/` : Téléchargement du PDF officiel généré avec ReportLab
- `POST /api/v1/prescriptions/certificates/` : Émission de certificats médicaux

---

## 🛠️ Commandes Utiles

### Créer un Superutilisateur Django dans un service
```bash
docker compose exec user_service python manage.py createsuperuser
```

### Arrêter l'infrastructure
```bash
docker compose down
```

### Réinitialiser complètement les bases de données
```bash
docker compose down -v
docker compose up --build
```
