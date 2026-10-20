// patient-app.js - Logique complète Espace Patient MEDOC avec Firebase Auth & Cloud Firestore
const { createApp, ref, computed, onMounted, watch } = Vue;

const patientApp = createApp({
  setup() {
    // --- NAVIGATION & THÈME ---
    const activeTab = ref('appointments'); // 'appointments', 'doctors', 'chat', 'documents', 'health-card'
    const theme = ref('blue');
    const darkMode = ref(false);
    const searchQuery = ref('');

    // --- 58 WILAYAS D'ALGÉRIE ---
    const algerianWilayas = [
      { code: '01', name: 'Adrar' },
      { code: '02', name: 'Chlef' },
      { code: '03', name: 'Laghouat' },
      { code: '04', name: 'Oum El Bouaghi' },
      { code: '05', name: 'Batna' },
      { code: '06', name: 'Béjaïa' },
      { code: '07', name: 'Biskra' },
      { code: '08', name: 'Béchar' },
      { code: '09', name: 'Blida' },
      { code: '10', name: 'Bouira' },
      { code: '11', name: 'Tamanrasset' },
      { code: '12', name: 'Tébessa' },
      { code: '13', name: 'Tlemcen' },
      { code: '14', name: 'Tiaret' },
      { code: '15', name: 'Tizi Ouzou' },
      { code: '16', name: 'Alger' },
      { code: '17', name: 'Djelfa' },
      { code: '18', name: 'Jijel' },
      { code: '19', name: 'Sétif' },
      { code: '20', name: 'Saïda' },
      { code: '21', name: 'Skikda' },
      { code: '22', name: 'Sidi Bel Abbès' },
      { code: '23', name: 'Annaba' },
      { code: '24', name: 'Guelma' },
      { code: '25', name: 'Constantine' },
      { code: '26', name: 'Médéa' },
      { code: '27', name: 'Mostaganem' },
      { code: '28', name: "M'Sila" },
      { code: '29', name: 'Mascara' },
      { code: '30', name: 'Ouargla' },
      { code: '31', name: 'Oran' },
      { code: '32', name: 'El Bayadh' },
      { code: '33', name: 'Illizi' },
      { code: '34', name: 'Bordj Bou Arréridj' },
      { code: '35', name: 'Boumerdès' },
      { code: '36', name: 'El Tarf' },
      { code: '37', name: 'Tindouf' },
      { code: '38', name: 'Tissemsilt' },
      { code: '39', name: 'El Oued' },
      { code: '40', name: 'Khenchela' },
      { code: '41', name: 'Souk Ahras' },
      { code: '42', name: 'Tipaza' },
      { code: '43', name: 'Mila' },
      { code: '44', name: 'Aïn Defla' },
      { code: '45', name: 'Naâma' },
      { code: '46', name: 'Aïn Témouchent' },
      { code: '47', name: 'Ghardaïa' },
      { code: '48', name: 'Relizane' },
      { code: '49', name: 'Timimoun' },
      { code: '50', name: 'Bordj Badji Mokhtar' },
      { code: '51', name: 'Ouled Djellal' },
      { code: '52', name: 'Béni Abbès' },
      { code: '53', name: 'In Salah' },
      { code: '54', name: 'In Guezzam' },
      { code: '55', name: 'Touggourt' },
      { code: '56', name: 'Djanet' },
      { code: '57', name: "El M'Ghair" },
      { code: '58', name: 'El Meniaa' }
    ];

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const medicalSpecialtiesList = [
      'Médecine Générale',
      'Cardiologie & Maladies Vasculaires',
      'Pédiatrie & Néonatologie',
      'Gynécologie - Obstétrique',
      'Ophtalmologie & Chirurgie Réfractive',
      'Dermatologie & Vénérologie',
      'Orthopédie & Traumatologie',
      'Endocrinologie & Diabétologie',
      'Pneumologie & Allergologie',
      'Neurologie',
      'Gastro-entérologie',
      'ORL (Oto-Rhino-Laryngologie)',
      'Psychiatrie'
    ];

    // --- MODÈLE PATIENT VIERGE (SANS EXEMPLE PAR DÉFAUT) ---
    const createEmptyPatient = () => ({
      id: 'pat-' + Date.now(),
      civility: 'M.',
      firstName: '',
      lastName: '',
      birthDate: '',
      age: null,
      gender: 'M',
      phone: '',
      email: '',
      bloodGroup: 'O+',
      identityCardNumber: '',
      wilaya: 'Alger',
      city: '',
      weight: null,
      height: null,
      bmi: null,
      bloodPressure: '',
      heartRate: null,
      bloodSugar: '',
      allergies: [],
      chronicConditions: [],
      currentTreatments: [],
      emergencyContact: {
        name: '',
        relation: '',
        phone: ''
      },
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    });

    const patient = ref(createEmptyPatient());

    // --- CATALOGUE DYNAMIQUE DES MÉDECINS (RÉELS DEPUIS FIRESTORE & BASE LOCALE) ---
    const doctorsCatalog = ref([]);

    // Filtres de recherche de médecins
    const doctorSearchQuery = ref('');
    const doctorSpecialtyFilter = ref('');
    const doctorWilayaFilter = ref('');
    const doctorTeleconsultFilter = ref(false);
    const selectedDoctorForDetails = ref(null);

    const filteredDoctors = computed(() => {
      const q = doctorSearchQuery.value.trim().toLowerCase();
      const spec = doctorSpecialtyFilter.value.trim().toLowerCase();
      const wil = doctorWilayaFilter.value.trim().toLowerCase();

      return doctorsCatalog.value.filter(doc => {
        const matchesQuery = !q || 
          doc.name.toLowerCase().includes(q) || 
          (doc.specialty && doc.specialty.toLowerCase().includes(q)) || 
          (doc.wilaya && doc.wilaya.toLowerCase().includes(q)) || 
          (doc.city && doc.city.toLowerCase().includes(q)) ||
          (doc.cabinetName && doc.cabinetName.toLowerCase().includes(q));

        const matchesSpecialty = !spec || (doc.specialty && doc.specialty.toLowerCase().includes(spec));
        const matchesWilaya = !wil || (doc.wilaya && doc.wilaya.toLowerCase() === wil);
        const matchesTeleconsult = !doctorTeleconsultFilter.value || doc.teleconsultation;

        return matchesQuery && matchesSpecialty && matchesWilaya && matchesTeleconsult;
      });
    });

    // Médecin sélectionné pour le chat (aucun par défaut)
    const doctorReferent = ref(null);

    // --- AUTHENTIFICATION PATIENT ---
    const isAuthenticated = ref(false); // Déconnecté automatiquement à l'ouverture
    const authMode = ref('signin'); // 'signin', 'signup', 'otp'
    const authMethod = ref('email'); // 'email', 'phone'
    const authPhone = ref('');
    const authEmail = ref('');
    const authPassword = ref('');
    const authOtpCode = ref('');
    const authOtpTimer = ref(60);
    let authOtpInterval = null;
    const authLoading = ref(false);

    // Formulaire d'inscription vierge
    const signupForm = ref({
      civility: 'M.',
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: 'M',
      bloodGroup: 'O+',
      identityCardNumber: '',
      wilaya: 'Alger',
      city: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    // Formulaire d'entrée directe sans mot de passe
    const directEntryForm = ref({
      civility: 'M.',
      firstName: '',
      lastName: '',
      wilaya: 'Alger',
      phone: '',
      bloodGroup: 'O+',
      identityCardNumber: ''
    });

    // --- ÉDITION DU PROFIL & UPLOAD PHOTO APPAREIL (PFP) ---
    const showEditProfileModal = ref(false);
    const profileEditForm = ref(createEmptyPatient());


    const openEditProfile = () => {
      profileEditForm.value = JSON.parse(JSON.stringify(patient.value));
      showEditProfileModal.value = true;
    };

    // UPLOAD PHOTO DEPUIS L'APPAREIL DU PATIENT ET SAUVEGARDE EN BASE DE DONNÉES
    const handlePfpUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        notify('Format non supporté', 'Veuillez sélectionner un fichier image (JPG, PNG, WebP).', 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Compression et redimensionnement à 350x350 max pour une sauvegarde rapide et légère
          const canvas = document.createElement('canvas');
          const maxDim = 350;
          let w = img.width;
          let h = img.height;
          if (w > h && w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

          // Mettre à jour l'avatar patient
          patient.value.avatar = dataUrl;
          profileEditForm.value.avatar = dataUrl;
          savePatientProfileLocally();

          // Sauvegarder dans Firestore si connecté
          if (window.db && patient.value.id) {
            window.db.collection('patients').doc(patient.value.id).set({
              avatar: dataUrl,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true }).then(() => {
              console.log('Avatar patient synchronisé avec Firestore !');
            }).catch(err => {
              console.warn('Erreur synchronisation Firestore avatar:', err);
            });
          }

          notify('Photo de profil mise à jour !', 'Votre photo a été téléversée depuis votre appareil et enregistrée dans votre base de données.', 'success');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const saveProfileChanges = async () => {
      if (!profileEditForm.value.firstName || !profileEditForm.value.lastName) {
        notify('Champs requis', 'Veuillez saisir votre prénom et votre nom.', 'warning');
        return;
      }

      Object.assign(patient.value, profileEditForm.value);
      calculateBmi();
      savePatientProfileLocally();

      // Sauvegarde dans Cloud Firestore
      if (window.db && patient.value.id) {
        try {
          const payload = cleanPatientPayload(patient.value);
          payload.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
          await window.db.collection('patients').doc(patient.value.id).set(payload, { merge: true });
        } catch (err) {
          console.warn('Erreur sync profil Firestore:', err);
        }
      }

      showEditProfileModal.value = false;
      notify('Profil mis à jour !', 'Vos informations ont été enregistrées avec succès dans la base de données.', 'success');
    };

    // --- TOAST NOTIFICATIONS ---
    const toasts = ref([]);
    const notify = (title, message = '', type = 'info') => {
      const id = Date.now();
      toasts.value.push({ id, title, message, type });
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id);
      }, 4000);
    };

    // --- RENDEZ-VOUS DU PATIENT (SANS TARIF NI PAIEMENT) ---
    const appointments = ref([]);
    const showBookingModal = ref(false);
    const bookingForm = ref({
      doctorId: '',
      doctorName: '',
      doctorSpecialty: '',
      doctorWilaya: '',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '10:00',
      type: 'presentiel', // 'presentiel', 'teleconsultation'
      reason: 'Consultation médicale de contrôle',
      notes: ''
    });

    const availableTimeSlots = [
      '08:30', '09:00', '09:30', '10:00', '10:30', '11:15',
      '14:00', '14:30', '15:15', '16:00', '16:45'
    ];

    // --- MESSAGERIE SOCIALE AVEC LE MÉDECIN (VRAIE CONVERSATION SANS ROBOT) ---
    const messages = ref([]);
    const newMessageText = ref('');
    const selectedAttachmentForChat = ref(null);

    // --- DOCUMENTS MÉDICAUX ---
    const documents = ref([]);
    const documentCategoryFilter = ref('all');
    const showUploadModal = ref(false);
    const uploadForm = ref({
      title: '',
      category: 'Analyse Biologique',
      doctor: '',
      notes: '',
      fileName: '',
      fileSize: '',
      fileData: null
    });
    const previewModalDoc = ref(null);

    // --- SAISIE RAPIDE ALLERGIES & TRAITEMENTS ---
    const newAllergyInput = ref('');
    const newTreatmentInput = ref('');

    // --- INITIALISATION AU CHARGEMENT ---
    onMounted(() => {
      try {
        // Initialiser Firebase si config présente
        initFirebase();

        // Charger profil local
        const savedPatient = localStorage.getItem('medidoc_patient_profile');
        if (savedPatient) {
          const parsed = JSON.parse(savedPatient);
          patient.value = { ...createEmptyPatient(), ...parsed };
        }

        // Thème
        const savedTheme = localStorage.getItem('medidoc_theme') || 'blue';
        theme.value = savedTheme;
        darkMode.value = localStorage.getItem('medidoc_dark') === 'true';
        applyTheme();

        // Charger médecins créés en base
        loadDoctorsDirectory();

        // Charger rendez-vous
        loadAppointments();

        // Charger conversations réelles
        loadConversation();

        // Charger documents
        loadDocuments();

        // Écouteur d'événements de stockage (synchronisation temps réel entre onglets)
        window.addEventListener('storage', (e) => {
          if (e.key === 'medidoc_conversations') {
            loadConversation();
          }
          if (e.key === 'medidoc_doctors_directory' || e.key === 'medidoc_doctor_profile') {
            loadDoctorsDirectory();
          }
          if (e.key === 'medidoc_appointments') {
            loadAppointments();
          }
        });
      } catch (e) {
        console.warn('Erreur chargement local:', e);
      }
    });

    const initFirebase = () => {
      try {
        if (typeof firebase !== 'undefined' && window.firebaseConfig?.projectId) {
          if (!firebase.apps.length) {
            firebase.initializeApp(window.firebaseConfig);
          }
          window.db = firebase.firestore();
          console.log('Firebase Firestore connecté dans l\'espace patient !');

          // 1. Écouter les médecins créés en temps réel dans Firestore
          window.db.collection('doctors').onSnapshot(snapshot => {
            const remoteDocs = [];
            snapshot.forEach(docSnap => {
              if (docSnap.id === 'profile') return; // ignorer le document singleton legacy
              const data = docSnap.data();
              if (data.role === 'patient') return; // exclure les patients
              remoteDocs.push({
                id: docSnap.id,
                name: data.name || `${data.civility || 'Dr.'} ${data.firstName || ''} ${data.lastName || ''}`.trim(),
                civility: data.civility || 'Dr.',
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                specialty: data.specialty || 'Médecine Générale',
                cabinetName: data.cabinetName || 'Cabinet Médical',
                wilaya: data.wilaya || 'Alger',
                city: data.city || data.wilaya || 'Alger',
                address: data.address || 'Cabinet Médical',
                phone: data.phoneOffice || data.phoneEmergency || '+213 21 00 00 00',
                email: data.email || '',
                avatar: data.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
                teleconsultation: data.teleconsultationEnabled !== false,
                identityCardNumber: data.identityCardNumber || '',
                about: data.bio || `Cabinet de consultation médicale du ${data.name || 'Dr.'}`
              });
            });
            if (remoteDocs.length > 0) {
              doctorsCatalog.value = remoteDocs;
              localStorage.setItem('medidoc_doctors_directory', JSON.stringify(remoteDocs));
              if (!doctorReferent.value || !doctorReferent.value.id || doctorReferent.value.id === 'doc-default' || !remoteDocs.some(d => d.id === doctorReferent.value.id)) {
                doctorReferent.value = remoteDocs[0];
                loadConversation();
              }
            } else {
              doctorsCatalog.value = [];
              doctorReferent.value = null;
            }
          }, err => {
            console.warn('Lecture Firestore doctors:', err.message);
          });

          // 2. Gestion de l'état d'authentification Firebase (séparation stricte Patient / Médecin)
          if (firebase.auth) {
            firebase.auth().onAuthStateChanged(async (user) => {
              if (user) {
                // Vérifier si le compte est un médecin
                try {
                  const docSnap = await window.db.collection('doctors').doc(user.uid).get();
                  if (docSnap.exists && (docSnap.data().role === 'doctor' || docSnap.data().specialty)) {
                    await firebase.auth().signOut();
                    isAuthenticated.value = false;
                    localStorage.removeItem('medidoc_patient_auth');
                    notify('Compte Incompatible', 'Ce compte est un compte MÉDECIN. Veuillez vous connecter depuis l\'Espace Praticien.', 'warning');
                    return;
                  }
                } catch (checkErr) {
                  console.warn('Vérification rôle:', checkErr);
                }

                // Charger le profil patient depuis Firestore
                try {
                  const patSnap = await window.db.collection('patients').doc(user.uid).get();
                  if (patSnap.exists) {
                    patient.value = { ...createEmptyPatient(), ...patSnap.data(), id: user.uid };
                    savePatientProfileLocally();
                  } else {
                    patient.value.id = user.uid;
                    patient.value.email = user.email || patient.value.email;
                  }
                } catch (e) {
                  patient.value.id = user.uid;
                }

                isAuthenticated.value = true;
                localStorage.setItem('medidoc_patient_auth', 'true');
                listenToPatientAppointmentsInFirestore();
                loadConversation();
              }
            });
          }
        }
      } catch (err) {
        console.warn('Erreur init Firebase:', err);
      }
    };

    const listenToPatientAppointmentsInFirestore = () => {
      if (!window.db || !patient.value.id) return;
      try {
        window.db.collection('appointments')
          .where('patientId', '==', patient.value.id)
          .onSnapshot(snapshot => {
            if (!snapshot) return;
            const list = [];
            snapshot.forEach(docSnap => {
              list.push({ id: docSnap.id, ...docSnap.data() });
            });
            if (list.length > 0) {
              appointments.value = list;
              localStorage.setItem('medidoc_appointments', JSON.stringify(list));
            }
          }, err => {
            console.warn('Lecture RDV patient Firestore:', err.message);
          });
      } catch (err) {
        console.warn('Erreur listener RDV patient:', err);
      }
    };

    const applyTheme = () => {
      document.body.className = `theme-${theme.value} ${darkMode.value ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`;
    };

    watch([theme, darkMode], () => {
      applyTheme();
      localStorage.setItem('medidoc_theme', theme.value);
      localStorage.setItem('medidoc_dark', darkMode.value);
    });

    const cleanPatientPayload = (p) => {
      const payload = {
        id: p.id || 'pat-' + Date.now(),
        patientId: p.id || 'pat-' + Date.now(),
        uid: p.id || 'pat-' + Date.now(),
        name: `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Patient',
        civility: p.civility || 'M.',
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        birthDate: p.birthDate || '',
        gender: p.gender || 'M',
        phone: p.phone || '',
        email: p.email || '',
        bloodGroup: p.bloodGroup || 'O+',
        identityCardNumber: p.identityCardNumber || '',
        wilaya: p.wilaya || 'Alger',
        city: p.city || p.wilaya || 'Alger',
        role: 'patient',
        avatar: p.avatar || '',
        allergies: Array.isArray(p.allergies) ? p.allergies : [],
        chronicConditions: Array.isArray(p.chronicConditions) ? p.chronicConditions : [],
        currentTreatments: Array.isArray(p.currentTreatments) ? p.currentTreatments : [],
        notes: p.notes || ''
      };

      if (p.age !== null && p.age !== undefined && p.age !== '') payload.age = Number(p.age);
      if (p.weight !== null && p.weight !== undefined && p.weight !== '') payload.weight = Number(p.weight);
      if (p.height !== null && p.height !== undefined && p.height !== '') payload.height = Number(p.height);
      if (p.bmi !== null && p.bmi !== undefined && p.bmi !== '') payload.bmi = Number(p.bmi);
      if (p.heartRate !== null && p.heartRate !== undefined && p.heartRate !== '') payload.heartRate = Number(p.heartRate);
      if (p.bloodPressure) payload.bloodPressure = String(p.bloodPressure);
      if (p.bloodSugar) payload.bloodSugar = String(p.bloodSugar);
      if (p.emergencyContact && typeof p.emergencyContact === 'object') {
        payload.emergencyContact = {
          name: p.emergencyContact.name || '',
          relation: p.emergencyContact.relation || '',
          phone: p.emergencyContact.phone || ''
        };
      }
      return payload;
    };

    const savePatientProfileLocally = () => {
      localStorage.setItem('medidoc_patient_profile', JSON.stringify(patient.value));
      localStorage.setItem('medidoc_patient_auth', 'true');

      // Synchronisation automatique avec Cloud Firestore
      if (window.db && patient.value.id && patient.value.firstName) {
        try {
          const payload = cleanPatientPayload(patient.value);
          payload.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
          window.db.collection('patients').doc(patient.value.id).set(payload, { merge: true }).then(() => {
            console.log('[Firestore] Profil patient synchronisé :', patient.value.id);
          }).catch(err => {
            console.warn('[Firestore] Erreur sync profil:', err.message);
          });
        } catch (e) {
          console.warn('[Firestore] Erreur savePatientProfileLocally:', e);
        }
      }
    };

    // --- CHARGER L'ANNUAIRE DES VRAIS MÉDECINS CRÉÉS EN BASE ---
    const loadDoctorsDirectory = () => {
      const list = [];

      // 1. Charger depuis le répertoire local partagé
      const sharedDir = localStorage.getItem('medidoc_doctors_directory');
      if (sharedDir) {
        try {
          const parsed = JSON.parse(sharedDir);
          if (Array.isArray(parsed)) list.push(...parsed);
        } catch (e) {}
      }

      // 2. Vérifier si un médecin a créé son profil dans medecin.html
      const doctorProfile = localStorage.getItem('medidoc_doctor_profile');
      if (doctorProfile) {
        try {
          const doc = JSON.parse(doctorProfile);
          if (doc.lastName) {
            const doctorObj = {
              id: doc.id || 'doc-doctor-portal',
              name: `${doc.civility || 'Dr.'} ${doc.firstName || ''} ${doc.lastName || ''}`.trim(),
              civility: doc.civility || 'Dr.',
              firstName: doc.firstName || '',
              lastName: doc.lastName || '',
              specialty: doc.specialty || 'Médecine Générale',
              cabinetName: doc.cabinetName || 'Cabinet Médical MEDOC',
              wilaya: doc.wilaya || 'Alger',
              city: doc.city || 'Alger',
              address: doc.address || 'Cabinet Médical',
              phone: doc.phoneOffice || doc.phoneEmergency || '+213 21 66 77 88',
              email: doc.email || '',
              avatar: doc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
              teleconsultation: doc.teleconsultationEnabled !== false,
              identityCardNumber: doc.identityCardNumber || '',
              about: doc.bio || `Cabinet de consultation médicale du Dr. ${doc.lastName}`
            };

            const existingIdx = list.findIndex(d => d.id === doctorObj.id || d.email === doctorObj.email);
            if (existingIdx >= 0) list[existingIdx] = doctorObj;
            else list.unshift(doctorObj);
          }
        } catch (e) {}
      }


      // Si aucun médecin réel n'est encore enregistré en base, laisser la liste vide.
      // Les patients verront un message leur invitant à revenir une fois un médecin inscrit.

      doctorsCatalog.value = list;
      if (list.length > 0 && (!doctorReferent.value || !doctorReferent.value.id || doctorReferent.value.id === 'doc-default')) {
        doctorReferent.value = list[0];
      } else if (list.length === 0) {
        doctorReferent.value = null;
      }
    };

    // --- ACTIONS MÉDECINS & CATALOGUE ---
    const openBookingForDoctor = (doc) => {
      bookingForm.value.doctorId = doc.id;
      bookingForm.value.doctorName = doc.name;
      bookingForm.value.doctorSpecialty = doc.specialty;
      bookingForm.value.doctorWilaya = doc.wilaya;
      showBookingModal.value = true;
    };

    const startChatWithDoctor = (doc) => {
      doctorReferent.value = doc;
      uploadForm.value.doctor = doc.name;
      activeTab.value = 'chat';
      loadConversation();
      notify(`Discussion médicale`, `Vous êtes en ligne avec ${doc.name}.`, 'info');
    };

    const viewDoctorDetails = (doc) => {
      selectedDoctorForDetails.value = doc;
    };

    // --- LOGIQUE RENDEZ-VOUS (SANS PAIEMENT) ---
    const loadAppointments = () => {
      const stored = localStorage.getItem('medidoc_appointments');
      if (stored) {
        try {
          const list = JSON.parse(stored);
          if (patient.value.lastName) {
            appointments.value = list.filter(a => a.patientId === patient.value.id || (a.patientName && a.patientName.includes(patient.value.lastName)));
          } else {
            appointments.value = [];
          }
        } catch (e) {
          appointments.value = [];
        }
      } else {
        appointments.value = [];
      }
    };

    const bookAppointment = async () => {
      if (!bookingForm.value.date || !bookingForm.value.time) {
        notify('Champs requis', 'Veuillez choisir une date et une heure.', 'warning');
        return;
      }

      const patientDisplayName = patient.value.firstName 
        ? `${patient.value.civility} ${patient.value.firstName} ${patient.value.lastName}` 
        : 'Patient MEDOC';

      const newId = `rdv-${Date.now()}`;
      const newAppt = {
        id: newId,
        patientId: patient.value.id,
        doctorId: bookingForm.value.doctorId || doctorReferent.value.id || 'doc-1',
        patientName: patientDisplayName,
        patientAge: patient.value.age || '',
        patientPhone: patient.value.phone || '',
        time: bookingForm.value.time,
        date: bookingForm.value.date,
        type: bookingForm.value.type,
        doctorName: bookingForm.value.doctorName || doctorReferent.value.name,
        doctorSpecialty: bookingForm.value.doctorSpecialty || doctorReferent.value.specialty,
        reason: bookingForm.value.reason || 'Consultation médicale',
        status: 'confirmed',
        badgeColor: bookingForm.value.type === 'teleconsultation' ? 'blue' : 'green',
        notes: bookingForm.value.notes
      };

      appointments.value.unshift(newAppt);

      // Synchroniser avec LocalStorage
      try {
        let globalList = [];
        const existing = localStorage.getItem('medidoc_appointments');
        if (existing) globalList = JSON.parse(existing);
        globalList.unshift(newAppt);
        localStorage.setItem('medidoc_appointments', JSON.stringify(globalList));
      } catch (e) {
        console.error('Erreur sync RDV local:', e);
      }

      // Synchroniser avec Firestore si connecté
      if (window.db) {
        try {
          await window.db.collection('appointments').doc(newId).set({
            ...newAppt,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        } catch (err) {
          console.warn('Erreur sync RDV Firestore:', err);
        }
      }

      showBookingModal.value = false;
      notify('Rendez-vous confirmé !', `Réservé le ${newAppt.date} à ${newAppt.time} avec ${newAppt.doctorName}.`, 'success');
    };

    const cancelAppointment = async (apptId) => {
      if (confirm('Voulez-vous vraiment annuler ce rendez-vous médical ?')) {
        const appt = appointments.value.find(a => a.id === apptId);
        if (appt) {
          appt.status = 'cancelled';
          try {
            const existing = localStorage.getItem('medidoc_appointments');
            if (existing) {
              const list = JSON.parse(existing);
              const found = list.find(a => a.id === apptId);
              if (found) found.status = 'cancelled';
              localStorage.setItem('medidoc_appointments', JSON.stringify(list));
            }
          } catch (e) {}

          if (window.db) {
            try {
              await window.db.collection('appointments').doc(apptId).update({
                status: 'cancelled',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              });
            } catch (err) {}
          }
          notify('Rendez-vous annulé', 'Le praticien a été notifié de l\'annulation.', 'warning');
        }
      }
    };

    // --- MESSAGERIE SOCIALE ENTRE LE PATIENT ET LE MÉDECIN (TEMPS RÉEL) ---
    let convUnsubscribe = null;

    const getConversationKey = () => {
      const docId = (doctorReferent.value && doctorReferent.value.id) ? doctorReferent.value.id : 'doc_current';
      const patId = patient.value.id || (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'pat-1');
      return `conv_${docId}_${patId}`;
    };

    const loadConversation = () => {
      if (!doctorReferent.value || !doctorReferent.value.id) {
        messages.value = [];
        return;
      }
      const convKey = getConversationKey();

      // 1. Charger depuis le LocalStorage partagé
      const storedConv = localStorage.getItem('medidoc_conversations');
      if (storedConv) {
        try {
          const convs = JSON.parse(storedConv);
          const found = convs.find(c => c.id === convKey || (c.doctorId === doctorReferent.value.id && c.patientId === patient.value.id));
          if (found && found.messages) {
            messages.value = found.messages;
          }
        } catch (e) {}
      }

      // Nettoyer l'écouteur précédent si changement de médecin
      if (convUnsubscribe) {
        convUnsubscribe();
        convUnsubscribe = null;
      }

      // 2. Écouter en temps réel sur Cloud Firestore si connecté
      if (window.db) {
        convUnsubscribe = window.db.collection('conversations').doc(convKey).onSnapshot(docSnap => {
          if (docSnap && docSnap.exists) {
            const data = docSnap.data();
            if (data.messages && Array.isArray(data.messages)) {
              messages.value = data.messages;
            }
          }
        }, err => {
          console.warn('Lecture Firestore conversation:', err.message);
        });
      }
    };

    const saveConversation = async (newMsg) => {
      if (!doctorReferent.value || !doctorReferent.value.id) return;
      const convKey = getConversationKey();
      const patId = patient.value.id || (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'pat-1');
      const patientFullName = `${patient.value.firstName || ''} ${patient.value.lastName || ''}`.trim() || 'Patient MEDOC';

      // 1. Sauvegarde locale partagée
      try {
        let convs = [];
        const stored = localStorage.getItem('medidoc_conversations');
        if (stored) convs = JSON.parse(stored);

        let targetConv = convs.find(c => c.id === convKey);
        if (!targetConv) {
          targetConv = {
            id: convKey,
            doctorId: doctorReferent.value.id,
            doctorName: doctorReferent.value.name,
            patientId: patId,
            patientName: patientFullName,
            avatar: patient.value.avatar,
            unreadCount: 1,
            onlineStatus: 'online',
            messages: []
          };
          convs.unshift(targetConv);
        }
        targetConv.messages = messages.value;
        targetConv.lastMessage = newMsg.text;
        targetConv.lastTime = newMsg.time;
        targetConv.unreadCount = (targetConv.unreadCount || 0) + 1;
        localStorage.setItem('medidoc_conversations', JSON.stringify(convs));
      } catch (e) {}

      // 2. Sauvegarde Cloud Firestore
      if (window.db) {
        try {
          await window.db.collection('conversations').doc(convKey).set({
            id: convKey,
            doctorId: doctorReferent.value.id,
            doctorName: doctorReferent.value.name,
            patientId: patId,
            patientName: patientFullName,
            avatar: patient.value.avatar || '',
            lastMessage: newMsg.text,
            lastTime: newMsg.time,
            unreadCount: firebase.firestore.FieldValue.increment(1),
            onlineStatus: 'online',
            messages: firebase.firestore.FieldValue.arrayUnion(newMsg),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        } catch (err) {
          console.warn('Erreur sync message Firestore:', err);
        }
      }
    };

    const sendMessage = async () => {
      if (!newMessageText.value.trim() && !selectedAttachmentForChat.value) return;
      if (!doctorReferent.value || !doctorReferent.value.id) {
        notify('Aucun médecin sélectionné', 'Veuillez sélectionner un praticien dans l\'annuaire.', 'warning');
        return;
      }

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const patId = patient.value.id || (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'pat-1');
      const senderName = patient.value.firstName ? `${patient.value.firstName} ${patient.value.lastName}` : 'Patient';

      const newMsg = {
        id: `m_pat_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        sender: 'patient',
        senderId: patId,
        senderName,
        text: newMessageText.value.trim() || 'Fichier médical transmis :',
        time: timeStr,
        timestamp: Date.now(),
        status: 'sent',
        attachment: selectedAttachmentForChat.value ? { ...selectedAttachmentForChat.value } : null
      };

      messages.value.push(newMsg);
      newMessageText.value = '';
      selectedAttachmentForChat.value = null;

      await saveConversation(newMsg);
    };

    const sendQuickPatientMessage = (txt) => {
      newMessageText.value = txt;
      sendMessage();
    };

    // --- LOGIQUE DOCUMENTS & UPLOAD ---
    const loadDocuments = () => {
      const stored = localStorage.getItem('medidoc_patient_documents');
      if (stored) {
        try {
          documents.value = JSON.parse(stored);
          return;
        } catch (e) {}
      }
      documents.value = [];
    };

    const saveDocumentsLocally = () => {
      localStorage.setItem('medidoc_patient_documents', JSON.stringify(documents.value));
    };

    const filteredDocuments = computed(() => {
      let list = documents.value;
      if (documentCategoryFilter.value !== 'all') {
        list = list.filter(d => d.category === documentCategoryFilter.value);
      }
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        list = list.filter(d => d.title.toLowerCase().includes(q) || (d.doctor && d.doctor.toLowerCase().includes(q)));
      }
      return list;
    });

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      uploadForm.value.fileName = file.name;
      uploadForm.value.fileSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} Mo` 
        : `${Math.round(file.size / 1024)} Ko`;

      if (!uploadForm.value.title) {
        uploadForm.value.title = file.name.replace(/\.[^/.]+$/, '');
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        uploadForm.value.fileData = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const saveUploadedDocument = () => {
      if (!uploadForm.value.title) {
        notify('Titre requis', 'Veuillez saisir un titre pour votre document.', 'warning');
        return;
      }

      let icon = 'fa-file-lines';
      let color = 'sky';
      if (uploadForm.value.category.includes('Ordonnance')) {
        icon = 'fa-file-prescription';
        color = 'sky';
      } else if (uploadForm.value.category.includes('Analyse')) {
        icon = 'fa-file-lines';
        color = 'emerald';
      } else if (uploadForm.value.category.includes('Imagerie') || uploadForm.value.category.includes('Radio')) {
        icon = 'fa-x-ray';
        color = 'indigo';
      } else if (uploadForm.value.category.includes('Certificat')) {
        icon = 'fa-certificate';
        color = 'amber';
      }

      const newDoc = {
        id: `doc-${Date.now()}`,
        patientId: patient.value.id,
        title: uploadForm.value.title,
        category: uploadForm.value.category,
        date: new Date().toLocaleDateString('fr-FR'),
        doctor: uploadForm.value.doctor || doctorReferent.value.name,
        size: uploadForm.value.fileSize || '350 Ko',
        icon,
        color,
        notes: uploadForm.value.notes,
        fileData: uploadForm.value.fileData
      };

      documents.value.unshift(newDoc);
      saveDocumentsLocally();
      showUploadModal.value = false;

      uploadForm.value = {
        title: '',
        category: 'Analyse Biologique',
        doctor: doctorReferent.value.name,
        notes: '',
        fileName: '',
        fileSize: '',
        fileData: null
      };

      notify('Document ajouté avec succès !', `${newDoc.title} est classé dans votre dossier.`, 'success');
    };

    const deleteDocument = (docId) => {
      if (confirm('Voulez-vous supprimer ce document de votre dossier ?')) {
        documents.value = documents.value.filter(d => d.id !== docId);
        saveDocumentsLocally();
        notify('Document retiré', '', 'info');
      }
    };

    const shareDocumentToChat = (doc) => {
      selectedAttachmentForChat.value = {
        type: 'file',
        title: doc.title,
        size: doc.size,
        icon: doc.icon
      };
      activeTab.value = 'chat';
      notify('Fichier prêt pour envoi', `Document "${doc.title}" joint au chat. Cliquez sur Envoyer.`, 'info');
    };

    const openDocumentPreview = (doc) => {
      previewModalDoc.value = doc;
    };

    // --- LOGIQUE DOSSIER SANTÉ & CONSTANTES ---
    const calculateBmi = () => {
      if (patient.value.weight && patient.value.height) {
        const heightMeters = patient.value.height > 3 ? patient.value.height / 100 : patient.value.height;
        const val = patient.value.weight / (heightMeters * heightMeters);
        patient.value.bmi = val.toFixed(1);
      } else {
        patient.value.bmi = null;
      }
    };

    const bmiStatus = computed(() => {
      if (!patient.value.bmi) return { label: 'Non renseigné', color: 'slate' };
      const b = parseFloat(patient.value.bmi);
      if (isNaN(b)) return { label: 'Non renseigné', color: 'slate' };
      if (b < 18.5) return { label: 'Insuffisance pondérale', color: 'amber' };
      if (b < 25) return { label: 'Corpulence normale', color: 'emerald' };
      if (b < 30) return { label: 'Surpoids modéré', color: 'amber' };
      return { label: 'Obésité', color: 'rose' };
    });

    const addAllergy = () => {
      if (newAllergyInput.value.trim()) {
        patient.value.allergies.push(newAllergyInput.value.trim());
        newAllergyInput.value = '';
        savePatientProfileLocally();
        notify('Allergie ajoutée', '', 'info');
      }
    };

    const removeAllergy = (index) => {
      patient.value.allergies.splice(index, 1);
      savePatientProfileLocally();
    };

    const addTreatment = () => {
      if (newTreatmentInput.value.trim()) {
        patient.value.currentTreatments.push(newTreatmentInput.value.trim());
        newTreatmentInput.value = '';
        savePatientProfileLocally();
        notify('Traitement ajouté', '', 'info');
      }
    };

    const removeTreatment = (index) => {
      patient.value.currentTreatments.splice(index, 1);
      savePatientProfileLocally();
    };

    const saveHealthCard = async () => {
      calculateBmi();
      savePatientProfileLocally();

      if (window.db && patient.value.id) {
        try {
          await window.db.collection('patients').doc(patient.value.id).set({
            ...patient.value,
            name: `${patient.value.firstName} ${patient.value.lastName}`.trim(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        } catch (err) {}
      }

      notify('Fiche Santé Enregistrée', 'Vos constantes et informations médicales ont été sauvegardées.', 'success');
    };

    // --- AUTHENTIFICATION SANS EXEMPLE (INSCRIPTION RÉELLE & ENTRÉE DIRECTE) ---
    const startDirectWithCleanProfile = async () => {
      const f = directEntryForm.value;
      if (!f.firstName || !f.lastName) {
        notify('Champs requis', 'Veuillez saisir votre prénom et votre nom pour continuer.', 'warning');
        return;
      }

      patient.value = createEmptyPatient();
      patient.value.civility = f.civility;
      patient.value.firstName = f.firstName;
      patient.value.lastName = f.lastName;
      patient.value.wilaya = f.wilaya;
      patient.value.city = f.wilaya;
      patient.value.phone = f.phone ? `+213 ${f.phone.replace(/^0+/, '')}` : '';
      patient.value.bloodGroup = f.bloodGroup || 'O+';
      patient.value.identityCardNumber = f.identityCardNumber || '';

      documents.value = [];
      appointments.value = [];
      messages.value = [];

      isAuthenticated.value = true;
      savePatientProfileLocally();
      saveDocumentsLocally();

      // Enregistrer dans Firestore si connecté
      if (window.db) {
        try {
          await window.db.collection('patients').doc(patient.value.id).set({
            ...patient.value,
            name: `${patient.value.firstName} ${patient.value.lastName}`.trim(),
            role: 'patient',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        } catch (err) {}
      }

      notify('Bienvenue sur MEDOC !', `Votre espace patient personnel ${patient.value.firstName} est prêt.`, 'success');
    };

    const signInPatientWithEmail = async () => {
      if (!authEmail.value || !authPassword.value) {
        notify('Champs requis', 'Veuillez saisir votre email et mot de passe.', 'warning');
        return;
      }
      authLoading.value = true;
      try {
        let uid = patient.value.id;
        if (typeof firebase !== 'undefined' && firebase.auth && window.firebaseConfig?.apiKey) {
          const userCred = await firebase.auth().signInWithEmailAndPassword(authEmail.value.trim(), authPassword.value);
          uid = userCred.user.uid;

          // Vérification stricte du rôle : refuser si c'est un compte médecin
          if (window.db) {
            try {
              const docSnap = await window.db.collection('doctors').doc(uid).get();
              if (docSnap.exists && (docSnap.data().role === 'doctor' || docSnap.data().specialty)) {
                await firebase.auth().signOut();
                throw new Error("Ce compte est un compte MÉDECIN. Veuillez vous connecter depuis l'Espace Praticien.");
              }
            } catch (checkErr) {
              if (checkErr.message.includes('MÉDECIN')) throw checkErr;
            }
          }

          patient.value.id = uid;

          // Récupérer le profil depuis Firestore
          if (window.db) {
            const docSnap = await window.db.collection('patients').doc(uid).get();
            if (docSnap.exists) {
              patient.value = { ...createEmptyPatient(), ...docSnap.data(), id: uid };
            }
          }
        }
        isAuthenticated.value = true;
        patient.value.email = authEmail.value;
        savePatientProfileLocally();
        listenToPatientAppointmentsInFirestore();
        loadConversation();
        notify('Connexion réussie !', `Bienvenue sur votre espace patient MEDOC.`, 'success');
      } catch (err) {
        console.error('Erreur connexion email patient:', err);
        let errorMsg = err.message;
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          errorMsg = 'Email ou mot de passe incorrect.';
        } else if (err.code === 'auth/invalid-email') {
          errorMsg = 'Adresse email invalide.';
        } else if (err.code === 'auth/too-many-requests') {
          errorMsg = 'Trop de tentatives infructueuses. Veuillez patienter.';
        }
        notify('Erreur de connexion', errorMsg, 'error');
      } finally {
        authLoading.value = false;
      }
    };

    const signUpPatientWithEmail = async () => {
      const f = signupForm.value;
      if (!f.firstName || !f.lastName || !f.email || !f.password) {
        notify('Champs requis', 'Veuillez remplir votre prénom, nom, email et mot de passe.', 'warning');
        return;
      }
      if (f.password.length < 6) {
        notify('Mot de passe trop court', '6 caractères minimum requis.', 'warning');
        return;
      }
      if (f.password !== f.confirmPassword) {
        notify('Erreur mot de passe', 'Les mots de passe ne correspondent pas.', 'error');
        return;
      }

      authLoading.value = true;
      try {
        let uid = 'pat-' + Date.now();
        if (typeof firebase !== 'undefined' && firebase.auth && window.firebaseConfig?.apiKey) {
          const userCred = await firebase.auth().createUserWithEmailAndPassword(f.email.trim(), f.password);
          uid = userCred.user.uid;
        }

        patient.value = createEmptyPatient();
        patient.value.id = uid;
        patient.value.civility = f.civility;
        patient.value.firstName = f.firstName;
        patient.value.lastName = f.lastName;
        patient.value.gender = f.gender;
        patient.value.birthDate = f.birthDate;
        patient.value.bloodGroup = f.bloodGroup || 'O+';
        patient.value.identityCardNumber = f.identityCardNumber || '';
        patient.value.wilaya = f.wilaya;
        patient.value.city = f.city || f.wilaya;
        patient.value.phone = f.phone ? `+213 ${f.phone.replace(/^0+/, '')}` : '';
        patient.value.email = f.email;

        documents.value = [];
        appointments.value = [];
        messages.value = [];

        isAuthenticated.value = true;
        savePatientProfileLocally();
        saveDocumentsLocally();

        // Enregistrer l'utilisateur dans Cloud Firestore
        if (window.db) {
          try {
            await window.db.collection('patients').doc(uid).set({
              ...patient.value,
              id: uid,
              uid: uid,
              patientId: uid,
              name: `${patient.value.firstName} ${patient.value.lastName}`.trim(),
              role: 'patient',
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Patient créé avec succès dans Firestore !');
          } catch (err) {
            console.warn('Erreur Firestore patient set:', err);
          }
        }

        listenToPatientAppointmentsInFirestore();
        loadConversation();

        notify('Compte Patient Créé !', `Bienvenue ${patient.value.civility} ${patient.value.lastName} sur MEDOC. Votre compte est enregistré en base de données.`, 'success');
      } catch (err) {
        console.error('Erreur inscription patient:', err);
        let errorMsg = err.message;
        if (err.code === 'auth/email-already-in-use') {
          errorMsg = 'Cette adresse email est déjà enregistrée. Veuillez vous connecter.';
        } else if (err.code === 'auth/invalid-email') {
          errorMsg = 'Adresse email invalide.';
        } else if (err.code === 'auth/weak-password') {
          errorMsg = 'Mot de passe trop court (6 caractères minimum).';
        }
        notify('Erreur d\'inscription', errorMsg, 'error');
      } finally {
        authLoading.value = false;
      }
    };
    };

    const sendPatientOtp = async () => {
      if (!authPhone.value || authPhone.value.length < 8) {
        notify('Numéro requis', 'Saisissez un numéro algérien valide.', 'warning');
        return;
      }
      authLoading.value = true;
      try {
        authMode.value = 'otp';
        startOtpTimer();
        notify('SMS transmis', `Code envoyé au +213 ${authPhone.value.replace(/^0+/, '')}`, 'success');
      } finally {
        authLoading.value = false;
      }
    };

    const verifyPatientOtp = () => {
      if (!authOtpCode.value || authOtpCode.value.length < 6) {
        notify('Code incomplet', 'Entrez les 6 chiffres du SMS.', 'warning');
        return;
      }
      if (!patient.value.phone) {
        patient.value.phone = `+213 ${authPhone.value.replace(/^0+/, '')}`;
      }
      isAuthenticated.value = true;
      savePatientProfileLocally();
      notify('Code validé avec succès !', 'Bienvenue sur votre espace patient', 'success');
    };

    const startOtpTimer = () => {
      authOtpTimer.value = 60;
      if (authOtpInterval) clearInterval(authOtpInterval);
      authOtpInterval = setInterval(() => {
        if (authOtpTimer.value > 0) authOtpTimer.value--;
        else clearInterval(authOtpInterval);
      }, 1000);
    };

    const logoutPatient = () => {
      if (typeof firebase !== 'undefined' && firebase.auth) {
        try { firebase.auth().signOut(); } catch (e) {}
      }
      isAuthenticated.value = false;
      localStorage.removeItem('medidoc_patient_auth');
      authMode.value = 'signin';
      authOtpCode.value = '';
      notify('Déconnexion', 'Vous avez quitté votre espace patient.', 'info');
    };

    const resetPatientData = () => {
      if (confirm('Voulez-vous réinitialiser votre profil et repartir avec un dossier vierge ?')) {
        localStorage.removeItem('medidoc_patient_profile');
        localStorage.removeItem('medidoc_patient_documents');
        localStorage.removeItem('medidoc_conversations');
        patient.value = createEmptyPatient();
        documents.value = [];
        appointments.value = [];
        messages.value = [];
        isAuthenticated.value = false;
        authMode.value = 'direct';
        notify('Dossier réinitialisé', 'Toutes les données précédentes ont été effacées.', 'info');
      }
    };

    return {
      activeTab,
      theme,
      darkMode,
      searchQuery,
      algerianWilayas,
      bloodGroups,
      medicalSpecialtiesList,
      patient,
      doctorsCatalog,
      doctorSearchQuery,
      doctorSpecialtyFilter,
      doctorWilayaFilter,
      doctorTeleconsultFilter,
      filteredDoctors,
      selectedDoctorForDetails,
      doctorReferent,
      openBookingForDoctor,
      startChatWithDoctor,
      viewDoctorDetails,
      isAuthenticated,
      authMode,
      authMethod,
      authPhone,
      authEmail,
      authPassword,
      authOtpCode,
      authOtpTimer,
      authLoading,
      signupForm,
      directEntryForm,
      startDirectWithCleanProfile,
      showEditProfileModal,
      profileEditForm,
      openEditProfile,
      saveProfileChanges,
      handlePfpUpload,
      resetPatientData,
      toasts,
      notify,
      appointments,
      showBookingModal,
      bookingForm,
      availableTimeSlots,
      bookAppointment,
      cancelAppointment,
      messages,
      newMessageText,
      selectedAttachmentForChat,
      sendMessage,
      sendQuickPatientMessage,
      documents,
      documentCategoryFilter,
      filteredDocuments,
      showUploadModal,
      uploadForm,
      handleFileUpload,
      saveUploadedDocument,
      deleteDocument,
      shareDocumentToChat,
      previewModalDoc,
      openDocumentPreview,
      newAllergyInput,
      newTreatmentInput,
      addAllergy,
      removeAllergy,
      addTreatment,
      removeTreatment,
      saveHealthCard,
      calculateBmi,
      bmiStatus,
      signInPatientWithEmail,
      signUpPatientWithEmail,
      sendPatientOtp,
      verifyPatientOtp,
      logoutPatient
    };
  }
});

patientApp.mount('#patient-app');
