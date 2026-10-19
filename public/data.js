// data.js - Données initiales et état par défaut du cabinet médical
const defaultDoctorProfile = {
  // Identité & Profession
  civility: "Dr.",
  firstName: "Alexandre",
  lastName: "Moreau",
  title: "Docteur en Médecine Générale & Cardiologie Préventive",
  specialty: "Médecine Générale & Santé Cardiovasculaire",
  subSpecialties: ["Hypertension Artérielle", "Échocardiographie", "Nutrition & Diabétologie", "Suivi Pédiatrique"],
  rpps: "10103847291",
  adeli: "751294820",
  bio: "Praticien diplômé de la Faculté de Médecine de Paris. Fort de 14 années d'expérience hospitalière et libérale, le Dr. Moreau prend en charge l'ensemble des consultations de médecine générale, le dépistage cardiologique et le suivi des pathologies chroniques des adultes et des enfants.",
  avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
  status: "available", // available, in_consultation, away
  statusMessage: "En consultation au cabinet",

  cabinetName: "Cabinet Médical MEDOC Santé",
  address: "42 Boulevard Haussmann",
  postalCode: "75009",
  city: "Alger Centre",
  wilaya: "Alger",
  country: "Algérie",
  floor: "3ème étage avec ascenseur",
  doorCode: "B3489",
  accessPmr: true,
  parking: "Parking public Indigo Haussmann à 100m",
  phoneOffice: "01 42 68 55 00",
  phoneEmergency: "06 12 34 56 78",
  email: "contact@dr-moreau-cabinet.fr",
  website: "www.docteur-moreau-paris.fr",

  // Conventionnement & Paiement
  conventionSector: "Secteur 1 (Conventionné CPAM)",
  acceptsCard: true,
  acceptsCash: true,
  acceptsCheck: true,
  acceptsTiersPayant: true,
  acceptsCarteVitale: true,
  
  // Paramètres de consultation
  slotDuration: 20, // en minutes
  teleconsultationEnabled: true,
  welcomeMessage: "Bienvenue sur le portail médical du Dr. Alexandre Moreau. Vous pouvez consulter vos rendez-vous, échanger en toute sécurité et transmettre vos documents médicaux.",

  // Horaires de consultation
  schedule: [
    { day: "Lundi", active: true, start: "08:30", end: "19:00", breakStart: "12:30", breakEnd: "14:00" },
    { day: "Mardi", active: true, start: "08:30", end: "19:00", breakStart: "12:30", breakEnd: "14:00" },
    { day: "Mercredi", active: true, start: "09:00", end: "18:00", breakStart: "12:30", breakEnd: "13:30" },
    { day: "Jeudi", active: true, start: "08:30", end: "19:00", breakStart: "12:30", breakEnd: "14:00" },
    { day: "Vendredi", active: true, start: "08:30", end: "17:30", breakStart: "12:30", breakEnd: "13:30" },
    { day: "Samedi", active: true, start: "09:00", end: "13:00", breakStart: "", breakEnd: "" },
    { day: "Dimanche", active: false, start: "Fermé", end: "", breakStart: "", breakEnd: "" }
  ],

  // Actes & Prestations Médicales
  tarifs: [
    { id: 1, name: "Consultation de Médecine Générale (Adulte / Enfant > 6 ans)", refund: "Consultation clinique approfondie", duration: "20 min" },
    { id: 2, name: "Consultation Pédiatrique (Nourrisson & Enfant jusqu'à 6 ans)", refund: "Suivi du développement & vaccins", duration: "25 min" },
    { id: 3, name: "Téléconsultation Vidéo Sécurisée", refund: "Téléconsultation HD en ligne", duration: "15 min" },
    { id: 4, name: "Électrocardiogramme (ECG) de repos au cabinet", refund: "Enregistrement & tracé cardiologique", duration: "30 min" },
    { id: 5, name: "Bilan Annuel Cardiovasculaire Complet", refund: "Dépistage HTA & constantes", duration: "35 min" },
    { id: 6, name: "Certificat médical d'aptitude au sport avec ECG", refund: "Examen cardiologique au repos", duration: "25 min" },
    { id: 7, name: "Suture petite plaie & pansement stérile", refund: "Soins d'urgence cabinet", duration: "30 min" }
  ],

  // Diplômes & Expériences
  degrees: [
    { year: "2012", title: "Diplôme d'État de Docteur en Médecine", institution: "Université Paris Cité - Faculté de Médecine" },
    { year: "2014", title: "D.E.S. Médecine Générale & Soins d'Urgence", institution: "AP-HP Hôpital Européen Georges-Pompidou" },
    { year: "2017", title: "D.U. Échocardiographie Doppler & Prévention Cardiovasculaire", institution: "Sorbonne Université - Paris VI" },
    { year: "2020", title: "Formation Continue : Prise en charge moderne du Diabète de type 2", institution: "Collège de Médecine Générale" }
  ],

  // Langues
  languages: ["Français (Courant)", "Anglais (Médical fluide)", "Arabe (Intermédiaire)", "Espagnol (Notions)"],

  // Personnalisation Apparence (Theme)
  theme: "blue", // blue, emerald, indigo, rose
  darkMode: false
};

// Liste des patients suivis
const initialPatients = [
  {
    id: "pat-1",
    name: "Sophie Martin",
    birthDate: "14/05/1988",
    age: 38,
    gender: "F",
    phone: "06 45 78 92 10",
    email: "sophie.martin@email.fr",
    bloodGroup: "A+",
    weight: "62 kg",
    height: "1.68 m",
    bmi: "22.0",
    allergies: ["Pénicilline", "Arachides"],
    chronicConditions: ["Asthme d'effort modéré"],
    currentTreatments: ["Ventoline 100µg (si besoin)", "Inuvair spray matin et soir"],
    notes: "Patient observante. A présenté une crise allergique mineure en 2024. Suivi tensionnel parfait.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    lastVisit: "02/10/2026",
    nextAppointment: "Aujourd'hui à 09:30"
  },
  {
    id: "pat-2",
    name: "Marc Benali",
    birthDate: "28/11/1965",
    age: 60,
    gender: "M",
    phone: "07 12 34 98 76",
    email: "marc.benali@wanadoo.fr",
    bloodGroup: "O+",
    weight: "84 kg",
    height: "1.76 m",
    bmi: "27.1",
    allergies: ["Aucune allergie connue"],
    chronicConditions: ["Hypertension artérielle essentielle", "Dyslipidémie"],
    currentTreatments: ["Amlodipine 5mg (1 comprimé/jour)", "Tahor 20mg (le soir)"],
    notes: "Objectif tensionnel < 130/80 mmHg. Doit renouveler son bilan biologique lipidique.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    lastVisit: "15/09/2026",
    nextAppointment: "Aujourd'hui à 10:15"
  },
  {
    id: "pat-3",
    name: "Éléonore Dupont",
    birthDate: "03/09/2022",
    age: 4,
    gender: "F",
    phone: "06 88 12 45 63 (Maman)",
    email: "claire.dupont@gmail.com",
    bloodGroup: "B+",
    weight: "16 kg",
    height: "1.04 m",
    bmi: "14.8",
    allergies: ["Aucune"],
    chronicConditions: ["Terrain atopique / eczéma"],
    currentTreatments: ["Crème émolliente Dexeryl"],
    notes: "Consultation pédiatrique pour fièvre brutale à 39°C depuis 24h avec toux sèche.",
    avatar: "https://images.unsplash.com/photo-1595454223600-91fbdd7ce398?auto=format&fit=crop&q=80&w=200",
    lastVisit: "12/06/2026",
    nextAppointment: "Aujourd'hui à 11:00"
  },
  {
    id: "pat-4",
    name: "Karim Zenati",
    birthDate: "19/02/1992",
    age: 34,
    gender: "M",
    phone: "06 99 87 23 44",
    email: "karim.zenati@pro.com",
    bloodGroup: "AB+",
    weight: "77 kg",
    height: "1.82 m",
    bmi: "23.2",
    allergies: ["Aspirine (bronchospasme)"],
    chronicConditions: ["Aucun antécédent majeur"],
    currentTreatments: ["Aucun traitement au long cours"],
    notes: "Téléconsultation demandée pour analyse de bilan sanguin et fatigue persistante.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    lastVisit: "18/07/2026",
    nextAppointment: "Aujourd'hui à 11:45"
  },
  {
    id: "pat-5",
    name: "Christiane Lefebvre",
    birthDate: "11/12/1951",
    age: 74,
    gender: "F",
    phone: "01 48 32 99 12",
    email: "c.lefebvre75@orange.fr",
    bloodGroup: "O-",
    weight: "68 kg",
    height: "1.62 m",
    bmi: "25.9",
    allergies: ["Sulfamides", "Iode"],
    chronicConditions: ["Diabète de type 2", "Gonarthrose bilatérale"],
    currentTreatments: ["Metformine 1000mg x 2", "Kardégic 75mg"],
    notes: "Contrôle trimestriel HbA1c (dernière valeur : 6.8%). Surveillance fonction rénale.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    lastVisit: "14/08/2026",
    nextAppointment: "Aujourd'hui à 14:30"
  },
  {
    id: "pat-6",
    name: "Julien Mercier",
    birthDate: "05/04/1999",
    age: 27,
    gender: "M",
    phone: "06 33 22 11 00",
    email: "j.mercier@tech.io",
    bloodGroup: "A-",
    weight: "73 kg",
    height: "1.79 m",
    bmi: "22.8",
    allergies: ["Acariens / Pollens"],
    chronicConditions: ["Migraines ophtalmiques occasionnelles"],
    currentTreatments: ["Zomigoro si crise"],
    notes: "Certificat de non-contre-indication à la pratique du semi-marathon avec électrocardiogramme.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    lastVisit: "05/03/2026",
    nextAppointment: "Aujourd'hui à 15:15"
  }
];

// Liste des Rendez-vous de la journée & de la semaine
const initialAppointments = [
  {
    id: "rdv-101",
    patientId: "pat-1",
    patientName: "Sophie Martin",
    patientAge: 38,
    patientPhone: "06 45 78 92 10",
    time: "09:00",
    endTime: "09:25",
    date: "2026-10-14",
    type: "presentiel", // presentiel, teleconsultation, urgence
    reason: "Renouvellement traitement asthme & auscultation pulmonaire",
    status: "completed", // completed, confirmed, in_progress, waiting, cancelled
    badgeColor: "gray",
    notes: "Tension 125/75, auscultation claire. Ordonnance 3 mois délivrée.",
    amount: 26.50
  },
  {
    id: "rdv-102",
    patientId: "pat-2",
    patientName: "Marc Benali",
    patientAge: 60,
    patientPhone: "07 12 34 98 76",
    time: "09:30",
    endTime: "09:55",
    date: "2026-10-14",
    type: "presentiel",
    reason: "Suivi HTA & contrôle électrocardiogramme (ECG)",
    status: "in_progress",
    badgeColor: "green",
    notes: "En salle d'examen numéro 1. ECG de repos en cours.",
    amount: 40.76
  },
  {
    id: "rdv-103",
    patientId: "pat-3",
    patientName: "Éléonore Dupont (Claire Dupont - Maman)",
    patientAge: 4,
    patientPhone: "06 88 12 45 63",
    time: "10:15",
    endTime: "10:40",
    date: "2026-10-14",
    type: "urgence",
    reason: "Syndrome fébrile à 39°C avec otalgie droite",
    status: "waiting",
    badgeColor: "amber",
    notes: "Patiente arrivée au cabinet. Installée en salle d'attente pédiatrique.",
    amount: 31.50
  },
  {
    id: "rdv-104",
    patientId: "pat-4",
    patientName: "Karim Zenati",
    patientAge: 34,
    patientPhone: "06 99 87 23 44",
    time: "11:00",
    endTime: "11:20",
    date: "2026-10-14",
    type: "teleconsultation",
    reason: "Lecture de bilan biologique sanguin & ferritine",
    status: "confirmed",
    badgeColor: "blue",
    notes: "Lien vidéo envoyé par SMS. Patient a téléversé ses résultats de laboratoire.",
    amount: 25.00
  },
  {
    id: "rdv-105",
    patientId: "pat-5",
    patientName: "Christiane Lefebvre",
    patientAge: 74,
    patientPhone: "01 48 32 99 12",
    time: "14:30",
    endTime: "15:00",
    date: "2026-10-14",
    type: "presentiel",
    reason: "Consultation trimestrielle diabète & renouvellement metformine",
    status: "confirmed",
    badgeColor: "indigo",
    notes: "Prévoir examen podologique de dépistage neuropathie.",
    amount: 26.50
  },
  {
    id: "rdv-106",
    patientId: "pat-6",
    patientName: "Julien Mercier",
    patientAge: 27,
    patientPhone: "06 33 22 11 00",
    time: "15:15",
    endTime: "15:45",
    date: "2026-10-14",
    type: "presentiel",
    reason: "Certificat médical d'aptitude sportive (Course à pied / Semi)",
    status: "confirmed",
    badgeColor: "emerald",
    notes: "Examen cardiologique au repos requis pour licence FFA.",
    amount: 50.00
  },
  {
    id: "rdv-107",
    patientId: "pat-1",
    patientName: "Sophie Martin",
    patientAge: 38,
    patientPhone: "06 45 78 92 10",
    time: "16:30",
    endTime: "16:50",
    date: "2026-10-14",
    type: "teleconsultation",
    reason: "Point téléphonique sur tolérance nouveau traitement",
    status: "confirmed",
    badgeColor: "blue",
    notes: "Vérifier absence de tachycardie ou effets indésirables.",
    amount: 25.00
  }
];

// Conversations et messages de la boîte de discussion
const initialConversations = [
  {
    id: "conv-1",
    patientId: "pat-1",
    patientName: "Sophie Martin",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    unreadCount: 1,
    onlineStatus: "online",
    lastMessage: "Docteur, voici ma courbe de débit expiratoire de pointe (Peak Flow) comme convenu.",
    lastTime: "09:42",
    category: "suivi",
    messages: [
      {
        id: "m-101",
        sender: "doctor",
        senderName: "Dr. Alexandre Moreau",
        text: "Bonjour Mme Martin, comment se passent les prises matinales de votre spray Inuvair ?",
        time: "Hier à 17:15",
        status: "read"
      },
      {
        id: "m-102",
        sender: "patient",
        senderName: "Sophie Martin",
        text: "Bonjour Dr. Moreau, beaucoup mieux ! La toux nocturne a totalement disparu depuis 3 jours.",
        time: "Hier à 18:02",
        status: "read"
      },
      {
        id: "m-103",
        sender: "doctor",
        senderName: "Dr. Alexandre Moreau",
        text: "C'est une excellente nouvelle. Pensez bien à vous rincer la bouche après chaque inhalation pour éviter toute irritation buccale.",
        time: "Hier à 18:30",
        status: "read"
      },
      {
        id: "m-104",
        sender: "patient",
        senderName: "Sophie Martin",
        text: "Docteur, voici ma courbe de débit expiratoire de pointe (Peak Flow) comme convenu.",
        time: "09:42",
        status: "unread",
        attachment: {
          type: "file",
          title: "Releve_PeakFlow_Octobre2026.pdf",
          size: "420 Ko",
          icon: "fa-file-pdf"
        }
      }
    ]
  },
  {
    id: "conv-2",
    patientId: "pat-4",
    patientName: "Karim Zenati",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    unreadCount: 2,
    onlineStatus: "online",
    lastMessage: "J'ai bien reçu les résultats d'analyses sanguines du laboratoire Biogroup, je vous les transmets.",
    lastTime: "08:15",
    category: "teleconsultation",
    messages: [
      {
        id: "m-201",
        sender: "patient",
        senderName: "Karim Zenati",
        text: "Bonjour Docteur, notre téléconsultation de ce matin à 11h00 est-elle toujours maintenue ?",
        time: "08:10",
        status: "read"
      },
      {
        id: "m-202",
        sender: "patient",
        senderName: "Karim Zenati",
        text: "J'ai bien reçu les résultats d'analyses sanguines du laboratoire Biogroup, je vous les transmets.",
        time: "08:15",
        status: "unread",
        attachment: {
          type: "file",
          title: "Analyse_Biologique_NFS_Ferritine.pdf",
          size: "1.2 Mo",
          icon: "fa-file-medical"
        }
      }
    ]
  },
  {
    id: "conv-3",
    patientId: "pat-2",
    patientName: "Marc Benali",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    unreadCount: 0,
    onlineStatus: "in_waiting_room",
    lastMessage: "Merci Docteur, je suis bien assis en salle d'attente.",
    lastTime: "09:20",
    category: "cabinet",
    messages: [
      {
        id: "m-301",
        sender: "doctor",
        senderName: "Dr. Alexandre Moreau",
        text: "Bonjour M. Benali, n'oubliez pas d'apporter votre carnet d'auto-mesure tensionnelle ce matin.",
        time: "08:45",
        status: "read"
      },
      {
        id: "m-302",
        sender: "patient",
        senderName: "Marc Benali",
        text: "Oui Docteur, je l'ai avec moi. Mes chiffres du matin étaient à 128/78.",
        time: "09:05",
        status: "read"
      },
      {
        id: "m-303",
        sender: "patient",
        senderName: "Marc Benali",
        text: "Merci Docteur, je suis bien assis en salle d'attente.",
        time: "09:20",
        status: "read"
      }
    ]
  },
  {
    id: "conv-4",
    patientId: "pat-3",
    patientName: "Claire Dupont (Maman d'Éléonore)",
    avatar: "https://images.unsplash.com/photo-1595454223600-91fbdd7ce398?auto=format&fit=crop&q=80&w=200",
    unreadCount: 0,
    onlineStatus: "offline",
    lastMessage: "Nous venons d'arriver au cabinet avec la petite. Merci beaucoup.",
    lastTime: "10:00",
    category: "urgence",
    messages: [
      {
        id: "m-401",
        sender: "patient",
        senderName: "Claire Dupont",
        text: "Bonjour Docteur Moreau, la petite a eu 39.2°C cette nuit. Elle se frotte l'oreille droite en pleurant.",
        time: "07:30",
        status: "read"
      },
      {
        id: "m-402",
        sender: "doctor",
        senderName: "Dr. Alexandre Moreau",
        text: "Bonjour Claire. Donnez-lui du Doliprane adapté à son poids (15mg/kg toutes les 6h). Je vous intercale au cabinet en urgence à 10h15.",
        time: "07:45",
        status: "read"
      },
      {
        id: "m-403",
        sender: "patient",
        senderName: "Claire Dupont",
        text: "Nous venons d'arriver au cabinet avec la petite. Merci beaucoup.",
        time: "10:00",
        status: "read"
      }
    ]
  },
  {
    id: "conv-5",
    patientId: "pat-5",
    patientName: "Christiane Lefebvre",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    unreadCount: 0,
    onlineStatus: "offline",
    lastMessage: "D'accord Docteur, à cet après-midi 14h30.",
    lastTime: "Hier à 11:20",
    category: "suivi",
    messages: [
      {
        id: "m-501",
        sender: "doctor",
        senderName: "Dr. Alexandre Moreau",
        text: "Mme Lefebvre, nous ferons le bilan de votre hémoglobine glyquée et de vos pieds cet après-midi.",
        time: "Hier à 11:00",
        status: "read"
      },
      {
        id: "m-502",
        sender: "patient",
        senderName: "Christiane Lefebvre",
        text: "D'accord Docteur, à cet après-midi 14h30.",
        time: "Hier à 11:20",
        status: "read"
      }
    ]
  }
];

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

// Documents médicaux du patient (analyses, ordonnances, imagerie)
const initialPatientDocuments = [
  {
    id: "doc-101",
    patientId: "pat-1",
    title: "Bilan_Sanguin_Complet_Pasteur.pdf",
    category: "Analyse Biologique",
    date: "08/10/2026",
    doctor: "Laboratoire d'Analyses Médicales Alger",
    size: "420 Ko",
    icon: "fa-file-lines",
    color: "emerald",
    notes: "NFS, Glycémie, Bilan Lipidique et Créatinine. Taux normaux."
  },
  {
    id: "doc-102",
    patientId: "pat-1",
    title: "Ordonnance_Inuvair_Ventoline.pdf",
    category: "Ordonnance",
    date: "02/10/2026",
    doctor: "Dr. Alexandre Moreau",
    size: "280 Ko",
    icon: "fa-file-prescription",
    color: "sky",
    notes: "Prescription 3 mois traitement de fond asthme."
  },
  {
    id: "doc-103",
    patientId: "pat-1",
    title: "Radiographie_Thorax_Face_Profil.jpg",
    category: "Imagerie Médicale",
    date: "14/08/2026",
    doctor: "Centre d'Imagerie El Biar",
    size: "1.8 Mo",
    icon: "fa-x-ray",
    color: "indigo",
    notes: "Absence de foyer infectieux évolutif. Silhouette cardiaque normale."
  },
  {
    id: "doc-104",
    patientId: "pat-1",
    title: "Certificat_Medical_Aptitude.pdf",
    category: "Certificat",
    date: "10/05/2026",
    doctor: "Dr. Alexandre Moreau",
    size: "190 Ko",
    icon: "fa-certificate",
    color: "amber",
    notes: "Certificat d'aptitude à la pratique du sport en club."
  }
];
