# MediDoc Pro - Portail Médical & Espace Praticien

Application web complète et moderne conçue pour les médecins et cabinets médicaux, permettant la consultation et la gestion de l'**Agenda des rendez-vous**, une **Boîte de conversation médicale sécurisée** avec les patients, et une **Personnalisation poussée du profil du médecin**.

---

## 🌟 Fonctionnalités Incluses

### 🔐 0. Inscription & Authentification par SMS (Sign In / Sign Up)
- **Connexion Praticien (Sign In)** : Saisie du numéro de portable avec sélecteur de pays (+33 France, +213 Algérie, +212 Maroc, +32 Belgique, etc.) ➡️ Envoi de SMS ➡️ Saisie du code à 6 chiffres OTP ➡️ Accès sécurisé.
- **Inscription Nouveau Médecin (Sign Up)** : Fiche complète de création de compte :
  - Civilité (Dr. / Pr.), Prénom, Nom
  - Spécialité médicale (Généraliste, Cardiologue, Pédiatre, etc.)
  - N° RPPS / ADELI (Ordre des médecins)
  - Nom du cabinet & Ville
  - Numéro de portable avec validation SMS instantanée
- **Intégration Firebase Phone Auth** (avec reCAPTCHA invisible) + **Mode Démo local** avec code de test `123456` sans coût ni limite de quota.
- **Bouton Déconnexion sécurisée** en 1 clic dans l'en-tête.

### 1. 📅 Agenda & Gestion des Rendez-vous des Patients
- **Vue en temps réel des rendez-vous de la journée** avec filtres dynamiques :
  - *Tous les créneaux*, *En consultation*, *En salle d'attente*, *Téléconsultations vidéo*, *Urgences*, *Terminés*.
- **Indicateurs clés du jour** : Nombre total de patients prévus, patients en salle d'attente, téléconsultations et honoraires estimés du jour.
- **Actions rapides pour chaque patient** :
  - Démarrer la consultation en 1 clic (passage automatique au statut "En cours" avec indicateur vert).
  - Ouvrir la discussion directe dans la messagerie.
  - Générer et imprimer une ordonnance médicale officielle.
  - Modifier le statut ou annuler un rendez-vous.
- **Ajout rapide de rendez-vous** via une fenêtre modale ergonomique (date, heure, durée, type de consultation, motif).

### 2. 💬 Boîte de Conversation & Messagerie Sécurisée
- **Liste des discussions patients** avec badges de statut (En ligne, Au cabinet, Hors-ligne) et compteur de messages non-lus.
- **Fil de discussion interactif** avec horodatage et simulation de réponses instantanées des patients pour tester le flux.
- **Transmission de documents & pièces jointes** :
  - Envoi instantané d'ordonnances signées (PDF), certificats médicaux, relevés biologiques ou imageries.
- **Réponses types pré-enregistrées** (*"Votre ordonnance a été générée"*, *"Veuillez poursuivre le traitement"*, *"Merci de venir à jeun"*, etc.).
- **Volet clinique contextuel du patient (Sidebar droite)** :
  - Groupe sanguin, IMC, allergies déclarées (en alerte rouge), traitements chroniques en cours et notes privées du médecin.

### 3. 👨‍⚕️ Personnalisation Complète du Profil Médecin ("avec beaucoup de choses")
- **Identité & Titres** : Titre (Dr./Pr.), Prénom, Nom, RPPS, ADELI, Spécialité principale, sous-spécialités, biographie complète.
- **Sélecteur visuel d'avatar de praticien** : 5 presets de portraits médicaux haute définition ou URL sur-mesure.
- **Cabinet & Coordonnées** : Nom du cabinet, adresse exacte, étage, digicode, accès PMR, parking, téléphone du secrétariat, ligne d'urgence, email pro.
- **Grille hebdomadaire des horaires** : Du Lundi au Dimanche avec configuration des heures d'ouverture, de fermeture et de la pause déjeuner.
- **Catalogue d'actes & tarifs personnalisables** : Table interactive permettant d'ajouter, modifier ou supprimer des actes médicaux avec leur prix en €, taux de remboursement et durée standard.
- **Cursus universitaire & Langues parlées** : Diplômes d'État, D.U., formations continues, et sélection des langues pratiquées au cabinet.
- **Personnalisation Visuelle & Thèmes** : 
  - 4 thèmes de couleurs médicales : *Bleu Médical*, *Vert Émeraude Clinique*, *Indigo Moderne*, *Rose Soin Pédiatrique*.
  - Mode Sombre (Dark Mode) / Mode Clair en 1 clic.
- **Aperçu Vue Patient** : Simulation de la fiche publique telle que vue par les patients pour la prise de rendez-vous.

### 4. 🖨️ Générateur d'Ordonnance Médicale Officielle
- Format officiel conforme aux prescriptions médicales avec en-tête automatique du cabinet (RPPS, adresse, téléphone).
- Médicaments, posologies, durée et consignes de prise.
- Prêt pour **impression papier ou export PDF** via le bouton d'impression intégré.

---

## 🚀 Comment Lancer l'Application

### Méthode 1 : Ouverture Directe (Aucune installation requise)
Double-cliquez simplement sur le fichier **`index.html`** dans l'explorateur de fichiers de Windows. Il s'ouvrira immédiatement dans votre navigateur préféré (Google Chrome, Microsoft Edge, Firefox, Brave).

### Méthode 2 : Avec le serveur local Python (Recommandé)
Dans PowerShell ou le terminal :
```powershell
cd C:\Users\MoundirBch\.gemini\antigravity\scratch\cabinet-medical-portal
python -m http.server 8080
```
Puis ouvrez votre navigateur à l'adresse : **[http://localhost:8080](http://localhost:8080)**.

---

## 🔥 Utiliser Firebase avec cette Application

**OUI, vous pouvez utiliser Firebase !** L'application a été conçue pour fonctionner de deux manières :

1. **Mode Local / Hors-ligne (Par défaut)** : Tout fonctionne immédiatement grâce au stockage `localStorage` sans avoir besoin de créer de compte.
2. **Mode Cloud Firebase & Firestore** :
   - Cliquez sur le badge **"Mode Local / Firebase"** en haut à droite du portail.
   - Saisissez les clés de configuration de votre projet Firebase (`apiKey`, `projectId`, `authDomain`).
   - L'application se connecte directement à votre base de données **Cloud Firestore** pour synchroniser en temps réel les rendez-vous, les messages et le profil du médecin !

### Structure des Collections Firestore :
- `doctors/{doctorId}` : Profil du médecin, coordonnées, horaires et tarifs.
- `appointments/{appointmentId}` : Liste des rendez-vous et statuts (en cours, attente, visio).
- `conversations/{conversationId}/messages/{messageId}` : Messages de la boîte de discussion.
- `patients/{patientId}` : Dossiers médicaux et antécédents des patients.
