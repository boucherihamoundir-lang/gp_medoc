// data.js - Données initiales et état par défaut du cabinet médical
const defaultDoctorProfile = {
  // Identité & Profession
  civility: "Dr.",
  firstName: "",
  lastName: "",
  title: "Médecin Praticien",
  specialty: "Médecine Générale",
  subSpecialties: [],
  rpps: "",
  adeli: "",
  bio: "",
  avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
  status: "available", // available, in_consultation, away
  statusMessage: "Disponible au cabinet",

  cabinetName: "Cabinet Médical",
  address: "",
  postalCode: "",
  city: "Alger",
  wilaya: "Alger",
  country: "Algérie",
  floor: "",
  doorCode: "",
  accessPmr: true,
  parking: "",
  phoneOffice: "",
  phoneEmergency: "",
  email: "",
  website: "",

  // Conventionnement & Paiement
  conventionSector: "Secteur Conventionné",
  acceptsCard: true,
  acceptsCash: true,
  acceptsCheck: false,
  acceptsTiersPayant: false,
  acceptsCarteVitale: false,
  
  // Paramètres de consultation
  slotDuration: 20, // en minutes
  teleconsultationEnabled: true,
  welcomeMessage: "Bienvenue sur le portail médical du cabinet. Prenez rendez-vous et échangez en toute sécurité.",

  // Horaires de consultation
  schedule: [
    { day: "Lundi", active: true, start: "08:30", end: "17:00", breakStart: "12:30", breakEnd: "13:30" },
    { day: "Mardi", active: true, start: "08:30", end: "17:00", breakStart: "12:30", breakEnd: "13:30" },
    { day: "Mercredi", active: true, start: "08:30", end: "17:00", breakStart: "12:30", breakEnd: "13:30" },
    { day: "Jeudi", active: true, start: "08:30", end: "17:00", breakStart: "12:30", breakEnd: "13:30" },
    { day: "Vendredi", active: true, start: "08:30", end: "17:00", breakStart: "12:30", breakEnd: "13:30" },
    { day: "Samedi", active: true, start: "09:00", end: "13:00", breakStart: "", breakEnd: "" },
    { day: "Dimanche", active: false, start: "Fermé", end: "", breakStart: "", breakEnd: "" }
  ],

  // Actes & Prestations Médicales
  tarifs: [],

  // Diplômes & Expériences
  degrees: [],

  // Langues
  languages: ["Français", "Arabe"],

  // Personnalisation Apparence (Theme)
  theme: "blue", // blue, emerald, indigo, rose
  darkMode: false
};

// Liste des patients suivis (vide par défaut, pas de données fictives)
const initialPatients = [];

// Liste des Rendez-vous de la journée & de la semaine (vide par défaut)
const initialAppointments = [];

// Conversations et messages de la boîte de discussion (vide par défaut)
const initialConversations = [];

// Modèles de réponses rapides pour la messagerie
const quickReplies = [
  "Votre ordonnance a bien été générée et mise à disposition.",
  "Bonjour, veuillez poursuivre le traitement prescrit jusqu'à la fin de la semaine.",
  "Résultats d'analyses reçus et tout à fait rassurants. Pas d'inquiétude.",
  "Merci de bien vous présenter à jeun depuis au moins 8 heures pour ce prélèvement.",
  "Veuillez prendre un rendez-vous en présentiel au cabinet pour un examen clinique approfondi.",
  "La posologie recommandée est de 1 comprimé le matin au cours du petit-déjeuner.",
  "Je vous joins le compte-rendu médical dans votre espace sécurisé."
];

// Presets d'avatars de médecin pour la personnalisation
const doctorAvatarPresets = [
  { label: "Homme - Praticien Moderne", url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400" },
  { label: "Femme - Praticienne Souriante", url: "https://images.unsplash.com/photo-1594824813639-4402636ebbf9?auto=format&fit=crop&q=80&w=400" },
  { label: "Homme - Cardiologue / Senior", url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400" },
  { label: "Femme - Pédiatre / Spécialiste", url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400" },
  { label: "Homme - Jeune Médecin", url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400" }
];

// Documents médicaux du patient (vide par défaut)
const initialPatientDocuments = [];
