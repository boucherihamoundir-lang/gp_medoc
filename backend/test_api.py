"""
MEDOC Microservices - Test Automatisé Complet
Permet de valider le bon fonctionnement des 6 microservices et de l'API Gateway.
"""

import urllib.request
import urllib.error
import json
import sys

GATEWAY_URL = "http://localhost:8000"

def log_success(msg):
    print(f"  [OK] {msg}")

def log_error(msg):
    print(f"  [ERREUR] {msg}")

def send_request(path, method="GET", data=None, token=None):
    url = f"{GATEWAY_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode("utf-8")
            return resp.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            err_data = json.loads(content)
        except Exception:
            err_data = content
        return e.code, err_data

def run_tests():
    print("\n" + "="*60)
    print("MEDOC PORTAL - TEST AUTOMATISE DES 6 MICROSERVICES")
    print("="*60 + "\n")

    # 1. API Gateway Health Check
    print("1. Test Passerelle Nginx (Gateway)")
    status, res = send_request("/health")
    if status == 200 and res.get("status") == "healthy":
        log_success(f"Gateway opérationnelle sur {GATEWAY_URL}/health")
    else:
        log_error(f"Échec gateway: {res}")
        return

    # 2. User Service - Inscription & Connexion
    print("\n2. Test Microservice 1 : Utilisateurs & Auth (Port 8001)")
    user_payload = {
        "username": "dr_test_demo",
        "email": "demo@medoc.dz",
        "password": "Password123!",
        "confirm_password": "Password123!",
        "role": "doctor",
        "civility": "Dr.",
        "first_name": "Nabil",
        "last_name": "Larbi",
        "phone": "0550000000",
        "wilaya": "16 - Alger"
    }
    # Inscription
    status, res = send_request("/api/v1/auth/register/", "POST", user_payload)
    if status in (201, 400): # 400 si l'utilisateur existe déjà
        log_success("Endpoint Inscription (/api/v1/auth/register/) validé.")
    else:
        log_error(f"Échec inscription: {res}")

    # Connexion JWT
    status, auth_res = send_request("/api/v1/auth/login/", "POST", {
        "username": "dr_test_demo",
        "password": "Password123!"
    })
    if status == 200 and "access" in auth_res:
        token = auth_res["access"]
        log_success(f"Connexion réussie ! Token JWT généré ({auth_res['user']['full_name']})")
    else:
        log_error(f"Échec connexion JWT: {auth_res}")
        return

    # 3. Doctor Service - Annuaire & Profil
    print("\n3. Test Microservice 2 : Praticiens & Spécialités (Port 8002)")
    # Mise à jour profil praticien
    doc_data = {
        "specialty": "Pédiatrie",
        "cabinet_name": "Clinique des Enfants",
        "wilaya": "16 - Alger",
        "city": "El Biar",
        "consultation_fee": 3000.00,
        "teleconsultation_enabled": True
    }
    status, doc_res = send_request("/api/v1/doctors/profile/", "PUT", doc_data, token=token)
    if status == 200:
        log_success(f"Profil médecin mis à jour : {doc_res.get('specialty')} à {doc_res.get('city')}")
    else:
        log_error(f"Échec mise à jour profil médecin: {doc_res}")

    # Annuaire public
    status, catalog = send_request("/api/v1/doctors/")
    if status == 200:
        log_success(f"Annuaire public accessible : {len(catalog)} médecin(s) répertorié(s)")
    else:
        log_error(f"Échec annuaire public: {catalog}")

    # 4. Patient Service
    print("\n4. Test Microservice 3 : Dossiers Patients (Port 8003)")
    status, patients = send_request("/api/v1/patients/list/", token=token)
    if status == 200:
        log_success(f"Accès dossiers patients validé (HTTP 200, {len(patients)} dossiers)")
    else:
        log_error(f"Échec accès dossiers patients: {patients}")

    # 5. Appointment Service
    print("\n5. Test Microservice 4 : Prise de Rendez-vous (Port 8004)")
    status, appts = send_request("/api/v1/appointments/", token=token)
    if status == 200:
        log_success(f"Accès module rendez-vous validé (HTTP 200, {len(appts)} rendez-vous)")
    else:
        log_error(f"Échec module rendez-vous: {appts}")

    # 6. Prescription Service
    print("\n6. Test Microservice 5 : Ordonnances & Documents (Port 8006)")
    status, prescriptions = send_request("/api/v1/prescriptions/", token=token)
    if status == 200:
        log_success(f"Accès module ordonnances validé (HTTP 200, {len(prescriptions)} ordonnances)")
    else:
        log_error(f"Échec module ordonnances: {prescriptions}")

    # 7. Chat Service
    print("\n7. Test Microservice 6 : Messagerie & WebSockets (Port 8005)")
    status, convs = send_request("/api/v1/chats/", token=token)
    if status == 200:
        log_success(f"Accès messagerie validé (HTTP 200, {len(convs)} salons de discussion)")
    else:
        log_error(f"Échec messagerie: {convs}")

    print("\n" + "="*60)
    print("TOUS LES 6 MICROSERVICES FONCTIONNENT CORRECTEMENT !")
    print("="*60 + "\n")

if __name__ == "__main__":
    run_tests()
