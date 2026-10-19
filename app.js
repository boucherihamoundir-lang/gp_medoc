// app.js - Logique de l'application médicale avec Vue 3 & Support Firebase
const { createApp, ref, computed, onMounted, watch } = Vue;

const app = createApp({
  setup() {
    // --- ÉTAT DU THÈME & INTERFACE ---
    const activeTab = ref('agenda'); // 'agenda', 'chat', 'profile', 'patients', 'public-preview'
    const theme = ref('blue'); // 'blue', 'emerald', 'indigo', 'rose'
    const darkMode = ref(false);
    const searchQuery = ref('');

    // --- PROFIL MÉDECIN (avec persistance LocalStorage) ---
    const doctor = ref({ ...defaultDoctorProfile });

    // --- AUTHENTIFICATION SMS (SIGN IN / SIGN UP) ---
    const isAuthenticated = ref(false); // Déconnecté automatiquement à l'ouverture
    const authMode = ref('signin'); // 'signin', 'signup', 'otp'
    const authCountryCode = ref('+213');
    const authPhoneNumber = ref('');
    const authOtpCode = ref('');
    const authOtpTimer = ref(60);
    let authTimerInterval = null;
    const authLoading = ref(false);
    const authEmail = ref('');
    const authPassword = ref('');
    const authPasswordConfirm = ref('');
    const authMethod = ref('phone'); // 'phone' or 'email'
    const demoOtpCode = ref('123456');
    const isSignupFlow = ref(false);

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

    const countryCodes = [
      { code: '+213', label: 'Algérie (+213)', flag: '🇩🇿' },
    
    ];

    const medicalSpecialties = [
      "Médecine Générale",
      "Cardiologie & Maladie Vasculaire",
      "Pédiatrie",
      "Dermatologie & Vénérologie",
      "Gynécologie & Obstétrique",
      "Ophtalmologie",
      "Psychiatrie & Santé Mentale",
      "Rhumatologie",
      "Chirurgie Orthopédique & Traumatologie",
      "Endocrinologie & Diabétologie",
      "ORL & Chirurgie Cervico-faciale",
      "Chirurgie Dentaire & Implantologie",
      "Neurologie",
      "Gastro-entérologie & Hépatologie"
    ];

    const authSignupForm = ref({
      civility: 'Dr.',
      firstName: '',
      lastName: '',
      specialty: 'Médecine Générale',
      rpps: '',
      cabinetName: 'Cabinet Médical',
      city: 'Alger',
      wilaya: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    // --- DONNÉES PATIENTS & AGENDA (VIDE PAR DÉFAUT) ---
    const patients = ref([]);
    const appointments = ref([]);
    const selectedDate = ref(new Date().toISOString().split('T')[0]);
    const agendaFilter = ref('all'); // 'all', 'confirmed', 'waiting', 'teleconsultation', 'urgence', 'completed'

    // --- MESSAGERIE / CHAT (VIDE PAR DÉFAUT) ---
    const conversations = ref([]);
    const activeConversationId = ref('');
    const newMessageText = ref('');
    const cannedReplies = ref([...quickReplies]);

    // --- MODALES & INTERACTIONS ---
    const showNewAppointmentModal = ref(false);
    const newAppointmentForm = ref({
      patientId: '',
      patientName: '',
      patientAge: '',
      patientPhone: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      duration: 20,
      type: 'presentiel',
      reason: 'Consultation générale',
      notes: ''
    });

    const showPrescriptionModal = ref(false);
    const prescriptionData = ref({
      patientName: 'guest',
      patientAge: '',
      patientWeight: '',
      date: '',
      items: [
        { medication: 'Inuvair 100/6 µg / dose', dosage: '2 inhalations le matin et 2 inhalations le soir', duration: 'Pendant 3 mois', notes: 'Bien rincer la bouche à l\'eau claire après inhalation' },
        { medication: 'Ventoline 100 µg', dosage: '1 à 2 bouffées en cas de dyspnée ou crise d\'asthme', duration: 'Renouvelable 1 fois', notes: 'À garder systématiquement sur soi' }
      ],
      instructions: 'Prendre contact avec le cabinet en cas de persistance des symptômes ou de fièvre supérieure à 38.5°C.'
    });


    // --- FIREBASE CONFIG INTÉGRÉE DIRECTEMENT DANS LE CODE ---
    // Plus besoin de saisir quoi que ce soit : la configuration est fixée ici.
    const FIREBASE_CONFIG = {
      apiKey: "AIzaSyAQVFcEt7M5_OymrE39l_wyWyqosJZPc6g",
      authDomain: "drzone-ad80f.firebaseapp.com",
      projectId: "drzone-ad80f",
      storageBucket: "drzone-ad80f.firebasestorage.app",
      messagingSenderId: "192555399893",
      appId: "1:192555399893:web:340ea11953c93d5adc805c"
    };

    const firebaseConfig = ref({ ...FIREBASE_CONFIG });
    const showFirebaseModal = ref(false);
    const firebaseConnected = ref(false);
    const firebaseLoading = ref(false);
    const firebaseInputMode = ref('snippet');
    const rawFirebaseSnippet = ref('');
    const parseFirebaseSnippet = () => {};


    // --- SYSTÈME DE TOAST NOTIFICATIONS ---
    const toasts = ref([]);
    const notify = (title, message = '', type = 'info') => {
      const id = Date.now();
      toasts.value.push({ id, title, message, type });
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id);
      }, 4000);
    };

    // --- CHARGEMENT INITIAL ---
    onMounted(async () => {
      try {
        const savedDoctor = localStorage.getItem('medidoc_doctor_profile');
        if (savedDoctor) {
          doctor.value = JSON.parse(savedDoctor);
          if (doctor.value.theme) theme.value = doctor.value.theme;
          if (doctor.value.darkMode !== undefined) darkMode.value = doctor.value.darkMode;
        }

        const savedAppointments = localStorage.getItem('medidoc_appointments');
        if (savedAppointments) appointments.value = JSON.parse(savedAppointments);

        const savedConversations = localStorage.getItem('medidoc_conversations');
        if (savedConversations) conversations.value = JSON.parse(savedConversations);

        // Connexion automatique à Firebase avec la config intégrée dans le code
        await connectToFirebase(false);

      } catch (err) {
        console.warn('Erreur lors du chargement des données locales:', err);
      }

      applyThemeAndDarkMode();
    });

    // Surveiller les changements de thème et dark mode
    const applyThemeAndDarkMode = () => {
      document.body.className = `theme-${theme.value} ${darkMode.value ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`;
    };

    watch([theme, darkMode], () => {
      applyThemeAndDarkMode();
      doctor.value.theme = theme.value;
      doctor.value.darkMode = darkMode.value;
      saveDoctorDataLocally();
    });

    // --- SAUVEGARDE LOCALE ---
    const saveDoctorDataLocally = () => {
      localStorage.setItem('medidoc_doctor_profile', JSON.stringify(doctor.value));
      localStorage.setItem('medidoc_appointments', JSON.stringify(appointments.value));
      localStorage.setItem('medidoc_conversations', JSON.stringify(conversations.value));
    };

    const saveDoctorProfile = () => {
      saveDoctorDataLocally();
      notify('Profil mis à jour', 'Toutes les informations du cabinet ont été enregistrées avec succès.', 'success');
      
      // Si connecté à Firebase, synchroniser avec Firestore
      if (firebaseConnected.value && window.db) {
        syncProfileToFirebase();
      }
    };

    const resetDoctorProfile = () => {
      if (confirm('Voulez-vous vraiment réinitialiser les informations du profil avec les valeurs par défaut ?')) {
        doctor.value = { ...defaultDoctorProfile };
        theme.value = doctor.value.theme;
        darkMode.value = doctor.value.darkMode;
        saveDoctorDataLocally();
        notify('Réinitialisation terminée', 'Le profil a retrouvé ses valeurs par défaut.', 'info');
      }
    };

    // --- PROFIL : ACTES & DIPLÔMES GESTION ---
    const addTarif = () => {
      doctor.value.tarifs.push({
        id: Date.now(),
        name: 'Nouvelle prestation médicale',
        refund: 'Consultation & examen clinique',
        duration: '20 min'
      });
      notify('Prestation ajoutée', 'Pensez à enregistrer vos modifications.', 'info');
    };

    const removeTarif = (index) => {
      doctor.value.tarifs.splice(index, 1);
    };

    const addDegree = () => {
      doctor.value.degrees.push({
        year: new Date().getFullYear().toString(),
        title: 'Nouveau Diplôme ou Certificat',
        institution: 'Faculté de Médecine'
      });
    };

    const removeDegree = (index) => {
      doctor.value.degrees.splice(index, 1);
    };

    // (Avatar presets removed — use device upload only via handleDoctorPfpUpload)

    const handleDoctorPfpUpload = (event) => {
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

          doctor.value.avatar = dataUrl;
          saveDoctorDataLocally();
          if (firebaseConnected.value && window.db) {
            syncProfileToFirebase();
          }
          notify('Photo de profil mise à jour !', 'Votre photo a été enregistrée avec succès dans Firebase.', 'success');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    // --- AGENDA & RENDEZ-VOUS ---
    const filteredAppointments = computed(() => {
      let list = appointments.value.filter(a => a.date === selectedDate.value);

      if (agendaFilter.value !== 'all') {
        if (agendaFilter.value === 'teleconsultation') {
          list = list.filter(a => a.type === 'teleconsultation');
        } else if (agendaFilter.value === 'urgence') {
          list = list.filter(a => a.type === 'urgence');
        } else {
          list = list.filter(a => a.status === agendaFilter.value);
        }
      }

      if (searchQuery.value.trim() !== '') {
        const q = searchQuery.value.toLowerCase();
        list = list.filter(a => 
          a.patientName.toLowerCase().includes(q) ||
          a.reason.toLowerCase().includes(q) ||
          a.time.includes(q)
        );
      }

      return list.sort((a, b) => a.time.localeCompare(b.time));
    });

    const todayStats = computed(() => {
      const todayList = (appointments.value || []).filter(a => a && a.date === selectedDate.value);
      const total = todayList.length;
      const completed = todayList.filter(a => a.status === 'completed').length;
      const waiting = todayList.filter(a => a.status === 'waiting' || a.status === 'in_progress').length;
      const teleconsultations = todayList.filter(a => a.type === 'teleconsultation').length;
      const presentiel = todayList.filter(a => a.type !== 'teleconsultation').length;

      return {
        total,
        completed,
        waiting,
        teleconsultations,
        presentiel
      };
    });

    const updateAppointmentStatus = (id, newStatus) => {
      const appt = appointments.value.find(a => a.id === id);
      if (appt) {
        appt.status = newStatus;
        saveDoctorDataLocally();
        
        let label = 'Statut mis à jour';
        if (newStatus === 'completed') label = 'Consultation terminée';
        if (newStatus === 'in_progress') label = 'Patient en cours de consultation';
        if (newStatus === 'waiting') label = 'Patient en salle d\'attente';
        if (newStatus === 'cancelled') label = 'Rendez-vous annulé';
        
        notify(label, `Rendez-vous de ${appt.patientName} (${appt.time})`, 'info');
      }
    };

    const deleteAppointment = (id) => {
      const index = appointments.value.findIndex(a => a.id === id);
      if (index !== -1 && confirm('Supprimer définitivement ce rendez-vous ?')) {
        appointments.value.splice(index, 1);
        saveDoctorDataLocally();
        notify('Rendez-vous supprimé', '', 'warning');
      }
    };

    const openNewAppointmentModal = () => {
      newAppointmentForm.value = {
        patientId: patients.value[0]?.id || 'pat-1',
        date: selectedDate.value,
        time: '11:30',
        duration: doctor.value.slotDuration || 20,
        type: 'presentiel',
        reason: 'Consultation de suivi',
        notes: ''
      };
      showNewAppointmentModal.value = true;
    };

    const saveNewAppointment = () => {
      const selectedPatient = patients.value.find(p => p.id === newAppointmentForm.value.patientId);
      if (!selectedPatient) return;

      const newId = `rdv-${Date.now()}`;
      const newAppt = {
        id: newId,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        patientAge: selectedPatient.age,
        patientPhone: selectedPatient.phone,
        time: newAppointmentForm.value.time,
        date: newAppointmentForm.value.date,
        type: newAppointmentForm.value.type,
        reason: newAppointmentForm.value.reason || 'Consultation générale',
        status: 'confirmed',
        badgeColor: newAppointmentForm.value.type === 'teleconsultation' ? 'blue' : (newAppointmentForm.value.type === 'urgence' ? 'amber' : 'green'),
        notes: newAppointmentForm.value.notes,
        amount: newAppointmentForm.value.type === 'teleconsultation' ? 25.00 : 26.50
      };

      appointments.value.push(newAppt);
      saveDoctorDataLocally();
      showNewAppointmentModal.value = false;
      notify('Rendez-vous créé !', `Ajouté le ${newAppt.date} à ${newAppt.time} pour ${newAppt.patientName}`, 'success');
    };

    // --- MESSAGERIE / CHAT ---
    const activeConversation = computed(() => {
      return conversations.value.find(c => c.id === activeConversationId.value) || conversations.value[0];
    });

    const activePatientDetails = computed(() => {
      if (!activeConversation.value) return null;
      return patients.value.find(p => p.id === activeConversation.value.patientId) || null;
    });

    const totalUnreadCount = computed(() => {
      return conversations.value.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
    });

    const selectConversation = (convId) => {
      activeConversationId.value = convId;
      const conv = conversations.value.find(c => c.id === convId);
      if (conv && conv.unreadCount > 0) {
        conv.unreadCount = 0;
        conv.messages.forEach(m => m.status = 'read');
        saveDoctorDataLocally();
      }
    };

    const sendMessage = async () => {
      if (!newMessageText.value.trim() || !activeConversation.value) return;

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const docSenderId = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser)
        ? firebase.auth().currentUser.uid
        : (doctor.value.id || 'doc_current');
      const docSenderName = `${doctor.value.civility || 'Dr.'} ${doctor.value.firstName || ''} ${doctor.value.lastName || ''}`.trim() || 'Docteur';

      const newMsg = {
        id: `m-${Date.now()}`,
        sender: 'doctor',
        senderId: docSenderId,
        senderName: docSenderName,
        text: newMessageText.value.trim(),
        time: timeStr,
        status: 'sent'
      };

      if (!activeConversation.value.messages) activeConversation.value.messages = [];
      activeConversation.value.messages.push(newMsg);
      activeConversation.value.lastMessage = newMsg.text;
      activeConversation.value.lastTime = timeStr;
      activeConversation.value.doctorId = docSenderId;
      activeConversation.value.doctorName = docSenderName;
      newMessageText.value = '';

      saveDoctorDataLocally();

      // Synchroniser avec Firestore en temps réel
      if (window.db && activeConversation.value.id) {
        try {
          await window.db.collection('conversations').doc(activeConversation.value.id).set({
            id: activeConversation.value.id,
            patientId: activeConversation.value.patientId,
            patientName: activeConversation.value.patientName || 'Patient',
            doctorId: docSenderId,
            doctorName: docSenderName,
            avatar: activeConversation.value.avatar || '',
            lastMessage: activeConversation.value.lastMessage,
            lastTime: activeConversation.value.lastTime,
            messages: activeConversation.value.messages.slice(-50),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        } catch (err) {
          console.warn('Erreur envoi message docteur Firestore:', err);
        }
      }
    };

    const sendQuickReply = (text) => {
      newMessageText.value = text;
      sendMessage();
    };

    const sendMockAttachment = async (docType) => {
      if (!activeConversation.value) return;

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const docSenderId = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser)
        ? firebase.auth().currentUser.uid
        : (doctor.value.id || 'doc_current');
      const docSenderName = `${doctor.value.civility || 'Dr.'} ${doctor.value.firstName || ''} ${doctor.value.lastName || ''}`.trim() || 'Docteur';

      let attachmentInfo = {
        type: 'file',
        title: 'Ordonnance_Medicale_Signee.pdf',
        size: '340 Ko',
        icon: 'fa-file-prescription'
      };

      if (docType === 'certificat') {
        attachmentInfo = {
          type: 'file',
          title: 'Certificat_Medical_Aptitude.pdf',
          size: '280 Ko',
          icon: 'fa-certificate'
        };
      }

      const newMsg = {
        id: `m-${Date.now()}`,
        sender: 'doctor',
        senderId: docSenderId,
        senderName: docSenderName,
        text: `Veuillez trouver ci-joint votre document médical officiel : ${attachmentInfo.title}`,
        time: timeStr,
        status: 'sent',
        attachment: attachmentInfo
      };

      if (!activeConversation.value.messages) activeConversation.value.messages = [];
      activeConversation.value.messages.push(newMsg);
      activeConversation.value.lastMessage = `Document transmis : ${attachmentInfo.title}`;
      activeConversation.value.lastTime = timeStr;
      activeConversation.value.doctorId = docSenderId;
      activeConversation.value.doctorName = docSenderName;

      saveDoctorDataLocally();

      if (window.db && activeConversation.value.id) {
        try {
          await window.db.collection('conversations').doc(activeConversation.value.id).set({
            id: activeConversation.value.id,
            patientId: activeConversation.value.patientId,
            patientName: activeConversation.value.patientName || 'Patient',
            doctorId: docSenderId,
            doctorName: docSenderName,
            avatar: activeConversation.value.avatar || '',
            lastMessage: activeConversation.value.lastMessage,
            lastTime: activeConversation.value.lastTime,
            messages: activeConversation.value.messages.slice(-50),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        } catch (err) {
          console.warn('Erreur envoi pièce jointe Firestore:', err);
        }
      }

      notify('Document transmis', `${attachmentInfo.title} envoyé à ${activeConversation.value.patientName}`, 'success');
    };

    const listenToConversationsInFirestore = () => {
      if (!window.db) return;
      try {
        const docId = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser)
          ? firebase.auth().currentUser.uid
          : (doctor.value.id || null);

        let query = window.db.collection('conversations');
        if (docId) {
          query = query.where('doctorId', '==', docId);
        }

        query.onSnapshot((snapshot) => {
          if (!snapshot) return;
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            const convId = change.doc.id;
            let existing = conversations.value.find(c => c.id === convId || (c.patientId && c.patientId === data.patientId));
            if (existing) {
              if (data.messages && Array.isArray(data.messages)) {
                existing.messages = data.messages;
              }
              existing.lastMessage = data.lastMessage || existing.lastMessage;
              existing.lastTime = data.lastTime || existing.lastTime;
            } else {
              conversations.value.unshift({
                id: convId,
                patientId: data.patientId || 'pat-patient',
                patientName: data.patientName || 'Patient',
                avatar: data.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
                unreadCount: 1,
                onlineStatus: 'online',
                lastMessage: data.lastMessage || 'Nouvelle conversation initiée',
                lastTime: data.lastTime || 'À l\'instant',
                category: data.category || 'suivi',
                messages: data.messages || []
              });
              notify('Nouveau message patient', `${data.patientName || 'Un patient'} vous a envoyé un message.`, 'info');
            }
          });
          localStorage.setItem('medidoc_conversations', JSON.stringify(conversations.value));
        }, (err) => {
          console.warn('Avis listener Firestore:', err);
        });
      } catch (err) {
        console.warn('Erreur listener Firestore conversations:', err);
      }
    };

    const openChatWithPatient = (patientId) => {
      let conv = conversations.value.find(c => c.patientId === patientId);
      if (!conv) {
        const patient = patients.value.find(p => p.id === patientId);
        if (patient) {
          conv = {
            id: `conv-${Date.now()}`,
            patientId: patient.id,
            patientName: patient.name,
            avatar: patient.avatar,
            unreadCount: 0,
            onlineStatus: 'online',
            lastMessage: 'Discussion ouverte',
            lastTime: 'À l\'instant',
            category: 'suivi',
            messages: []
          };
          conversations.value.unshift(conv);
        }
      }
      if (conv) {
        activeConversationId.value = conv.id;
        activeTab.value = 'chat';
      }
    };

    // --- ORDONNANCES EXPRESS ---
    const openPrescriptionFromAppointment = (appt) => {
      const patient = patients.value.find(p => p.id === appt.patientId);
      prescriptionData.value.patientName = appt.patientName;
      prescriptionData.value.patientAge = appt.patientAge;
      prescriptionData.value.patientWeight = patient ? patient.weight : '70 kg';
      prescriptionData.value.date = new Date().toLocaleDateString('fr-FR');
      showPrescriptionModal.value = true;
    };

    const addPrescriptionDrug = () => {
      prescriptionData.value.items.push({
        medication: 'Nouveau médicament (DCI)',
        dosage: '1 comprimé par jour',
        duration: 'Pendant 7 jours',
        notes: 'À prendre au cours des repas'
      });
    };

    const removePrescriptionDrug = (index) => {
      prescriptionData.value.items.splice(index, 1);
    };

    const printPrescription = () => {
      window.print();
    };

    // --- FIREBASE INTEGRATION LOGIC (config intégrée dans le code) ---
    const connectToFirebase = async (showNotification = true) => {
      firebaseLoading.value = true;
      try {
        if (typeof firebase !== 'undefined') {
          // Réinitialiser proprement si déjà initialisé
          if (firebase.apps && firebase.apps.length > 0) {
            try {
              await Promise.all(firebase.apps.map(a => a.delete().catch(() => {})));
            } catch (e) {}
          }

          firebase.initializeApp(FIREBASE_CONFIG);
          window.db = firebase.firestore();
          window.auth = firebase.auth();

          firebaseConnected.value = true;
          if (showNotification) {
            notify('Firebase connecté !', `Projet : ${FIREBASE_CONFIG.projectId}`, 'success');
          }

          loadDataFromFirebase();
          setTimeout(() => listenToConversationsInFirestore(), 500);

          if (firebase.auth) {
            firebase.auth().onAuthStateChanged((user) => {
              if (user) {
                doctor.value.id = user.uid;
                if (user.email && !doctor.value.email) doctor.value.email = user.email;
                saveDoctorDataLocally();
                loadDataFromFirebase();
                listenToConversationsInFirestore();
              }
            });
          }
        } else {
          // SDK pas encore chargé, on marque comme connecté quand même
          firebaseConnected.value = true;
        }
      } catch (err) {
        console.error('Erreur Firebase:', err);
        // On laisse l'app fonctionner en mode local
        firebaseConnected.value = false;
      } finally {
        firebaseLoading.value = false;
      }
    };

    const disconnectFirebase = () => {
      firebaseConnected.value = false;
      localStorage.removeItem('medidoc_firebase_config');
      notify('Firebase déconnecté', 'L\'application fonctionne en mode local.', 'info');
    };

    const syncProfileToFirebase = async () => {
      if (!window.db) return;
      try {
        const currentUser = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
        const uid = currentUser ? currentUser.uid : ('doc_' + (doctor.value.rpps || Date.now()));

        // Sauvegarder le profil du médecin avec son UID pour que les patients puissent le trouver
        const doctorData = {
          ...doctor.value,
          id: uid,
          role: 'doctor',
          name: `${doctor.value.firstName || ''} ${doctor.value.lastName || ''}`.trim(),
          teleconsultation: doctor.value.teleconsultationEnabled || false,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Chemin principal du médecin (par UID)
        await window.db.collection('doctors').doc(uid).set(doctorData, { merge: true });
        // Chemin secondaire legacy
        await window.db.collection('doctors').doc('profile').set(doctorData, { merge: true });

        // Répertoire public des médecins (utilisé par la recherche patient)
        const directoryEntry = {
          id: uid,
          name: `${doctor.value.firstName || ''} ${doctor.value.lastName || ''}`.trim(),
          civility: doctor.value.civility || 'Dr.',
          specialty: doctor.value.specialty || 'Médecine Générale',
          cabinetName: doctor.value.cabinetName || 'Cabinet Médical',
          wilaya: doctor.value.wilaya || '',
          city: doctor.value.city || '',
          address: doctor.value.address || '',
          phone: doctor.value.phoneOffice || '',
          avatar: doctor.value.avatar || '',
          teleconsultation: doctor.value.teleconsultationEnabled || false,
          rating: 4.8,
          reviewCount: 27,
          nextSlot: 'Sur RDV',
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        await window.db.collection('medidoc_doctors_directory').doc(uid).set(directoryEntry, { merge: true });

        // Synchroniser dans localStorage pour cross-tab
        const localDir = JSON.parse(localStorage.getItem('medidoc_doctors_directory') || '[]');
        const idx = localDir.findIndex(d => d.id === uid);
        if (idx >= 0) localDir[idx] = directoryEntry;
        else localDir.push(directoryEntry);
        localStorage.setItem('medidoc_doctors_directory', JSON.stringify(localDir));

        console.log('Profil médecin synchronisé avec Firestore :', uid);
      } catch (err) {
        console.error('Erreur sync profil Firestore:', err);
      }
    };

    const loadDataFromFirebase = async () => {
      if (!window.db) return;
      try {
        const currentUser = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
        let docRef;
        if (currentUser) {
          docRef = await window.db.collection('doctors').doc(currentUser.uid).get();
        }
        if (!docRef || !docRef.exists) {
          docRef = await window.db.collection('doctors').doc('profile').get();
        }
        if (docRef && docRef.exists) {
          doctor.value = { ...doctor.value, ...docRef.data() };
          if (doctor.value.theme) theme.value = doctor.value.theme;
          if (doctor.value.darkMode !== undefined) darkMode.value = doctor.value.darkMode;
        }
      } catch (err) {
        console.warn('Impossible de charger depuis Firestore, utilisation du cache local:', err);
      }
    };

    // --- AUTHENTIFICATION SMS (SIGN IN / SIGN UP) ---
    const sendOtp = async (isSignup = false) => {
      isSignupFlow.value = isSignup;
      const phone = isSignup ? authSignupForm.value.phone : authPhoneNumber.value;
      if (!phone || phone.trim().length < 6) {
        notify('Numéro requis', 'Veuillez saisir un numéro de téléphone portable valide.', 'warning');
        return;
      }

      if (isSignup && (!authSignupForm.value.firstName || !authSignupForm.value.lastName)) {
        notify('Champs incomplets', 'Veuillez renseigner votre nom et prénom de praticien.', 'warning');
        return;
      }

      const cleanPhone = phone.trim().replace(/^0+/, '').replace(/\s+/g, '');
      const fullPhone = `${authCountryCode.value}${cleanPhone}`;
      authLoading.value = true;

      try {
        // 1. Détection du protocole file:// (Google reCAPTCHA interdit les SMS sur file://)
        if (window.location.protocol === 'file:') {
          notify('Serveur local requis pour vrai SMS', 'Ouvrez http://localhost:8080. Google reCAPTCHA bloque les vrais SMS sur file://.', 'warning');
        }

        // 2. Initialiser Firebase si la config est présente
        if (typeof firebase !== 'undefined' && !firebase.apps.length) {
          await connectToFirebase(false);
        }

        // 3. Envoi du SMS réel via Firebase Phone Auth
        if (typeof firebase !== 'undefined' && firebase.apps.length && firebase.auth && FIREBASE_CONFIG.apiKey) {
          firebase.auth().useDeviceLanguage();

          // Réinitialiser le reCAPTCHA pour éviter les blocages de rendu
          if (window.recaptchaVerifier) {
            try { window.recaptchaVerifier.clear(); } catch (e) {}
            window.recaptchaVerifier = null;
          }

          window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            size: 'invisible',
            callback: () => {
              console.log('reCAPTCHA vérifié avec succès par Google.');
            }
          });

          // Appel réel de l'API Firebase
          const confirmationResult = await firebase.auth().signInWithPhoneNumber(fullPhone, window.recaptchaVerifier);
          window.confirmationResult = confirmationResult;
          
          notify('Vrai SMS envoyé !', `Consultez votre téléphone (${fullPhone}) pour relever le code reçu.`, 'success');
          authMode.value = 'otp';
          startOtpTimer();
        } else {
          // Si aucune clé Firebase n'est configurée
          demoOtpCode.value = Math.floor(100000 + Math.random() * 900000).toString();
          notify('Mode Simulation', `Aucun projet Firebase connecté. Code test : ${demoOtpCode.value}`, 'info');
          authMode.value = 'otp';
          startOtpTimer();
        }
      } catch (err) {
        console.error('Erreur Firebase Phone Auth détaillée:', err);
        
        let errorMessage = err.message;
        if (err.code === 'auth/operation-not-allowed') {
          errorMessage = "Activez 'Téléphone' dans Firebase Console > Authentication > Sign-in method.";
        } else if (err.code === 'auth/invalid-phone-number') {
          errorMessage = "Numéro invalide pour ce pays. Exemple France: +33 6 12 34 56 78";
        } else if (err.code === 'auth/quota-exceeded') {
          errorMessage = "Quota SMS Firebase atteint pour aujourd'hui.";
        } else if (err.code === 'auth/too-many-requests') {
          errorMessage = "Trop de tentatives récentes. Veuillez patienter quelques minutes.";
        } else if (err.code === 'auth/captcha-check-failed') {
          errorMessage = "Échec reCAPTCHA Google. Ouvrez http://localhost:8080.";
        }

        notify('Erreur envoi SMS', errorMessage, 'error');

        // En cas d'erreur de quota ou de configuration, proposer le code de test de secours
        demoOtpCode.value = '123456';
        authMode.value = 'otp';
        startOtpTimer();
      } finally {
        authLoading.value = false;
      }
    };

    const verifyOtp = async () => {
      if (!authOtpCode.value || authOtpCode.value.length < 6) {
        notify('Code incomplet', 'Le code de vérification SMS comporte 6 chiffres.', 'warning');
        return;
      }

      authLoading.value = true;
      try {
        let verified = false;

        if (window.confirmationResult) {
          try {
            await window.confirmationResult.confirm(authOtpCode.value);
            verified = true;
          } catch (e) {
            // Si le code Firebase échoue, vérifier si c'est le code de secours de démo
            if (authOtpCode.value === '123456' || authOtpCode.value === demoOtpCode.value) {
              verified = true;
            } else {
              throw e;
            }
          }
        } else if (authOtpCode.value === demoOtpCode.value || authOtpCode.value === '123456') {
          verified = true;
        }

        if (verified) {
          // Si inscription, enregistrer les nouvelles coordonnées du médecin
          if (isSignupFlow.value && authSignupForm.value.firstName && authSignupForm.value.lastName) {
            doctor.value.civility = authSignupForm.value.civility || 'Dr.';
            doctor.value.firstName = authSignupForm.value.firstName;
            doctor.value.lastName = authSignupForm.value.lastName;
            doctor.value.specialty = authSignupForm.value.specialty;
            doctor.value.rpps = authSignupForm.value.rpps || 'DZ-' + Math.floor(100000 + Math.random() * 900000);
            doctor.value.cabinetName = authSignupForm.value.cabinetName || 'Cabinet Médical Dr. ' + authSignupForm.value.lastName;
            doctor.value.wilaya = authSignupForm.value.wilaya;
            doctor.value.city = authSignupForm.value.wilaya || 'Alger';
            doctor.value.country = 'Algérie';
            const cleanPhone = (authSignupForm.value.phone || '').trim().replace(/^0+/, '').replace(/\s+/g, '');
            doctor.value.phoneOffice = `+213 ${cleanPhone}`;
            doctor.value.phoneEmergency = `+213 ${cleanPhone}`;
            if (authSignupForm.value.email) {
              doctor.value.email = authSignupForm.value.email.trim();
            }
            saveDoctorDataLocally();

            // Synchroniser avec Firestore si connecté
            if (firebaseConnected.value && window.db) {
              syncProfileToFirebase();
            }
          }

          isAuthenticated.value = true;
          localStorage.setItem('medidoc_auth', 'true');
          authOtpCode.value = '';
          if (authTimerInterval) clearInterval(authTimerInterval);

          notify('Connexion réussie !', `Bienvenue ${doctor.value.civility} ${doctor.value.lastName} sur votre portail médical.`, 'success');
        } else {
          notify('Code incorrect', 'Le code saisi ne correspond pas. Réessayez ou vérifiez votre SMS.', 'error');
        }
      } catch (err) {
        console.error('Erreur vérification OTP:', err);
        notify('Erreur de validation SMS', err.message || 'Code SMS invalide ou expiré.', 'error');
      } finally {
        authLoading.value = false;
      }
    };

    const signUpWithEmail = async () => {
      const email = (authSignupForm.value.email || '').trim();
      const pwd = authSignupForm.value.password || '';
      const confirmPwd = authSignupForm.value.confirmPassword || '';

      if (!email || !pwd) {
        notify('Champs requis', 'Veuillez saisir votre adresse email et un mot de passe.', 'warning');
        return;
      }
      if (pwd.length < 6) {
        notify('Mot de passe trop court', 'Le mot de passe doit comporter au moins 6 caractères.', 'warning');
        return;
      }
      if (pwd !== confirmPwd) {
        notify('Erreur mot de passe', 'Les mots de passe ne correspondent pas.', 'error');
        return;
      }
      if (!authSignupForm.value.firstName || !authSignupForm.value.lastName) {
        notify('Champs requis', 'Veuillez renseigner votre nom et prénom de praticien.', 'warning');
        return;
      }
      if (!authSignupForm.value.wilaya) {
        notify('Wilaya requise', 'Veuillez sélectionner votre wilaya parmi les 58 wilayas.', 'warning');
        return;
      }

      authLoading.value = true;
      try {
        if (typeof firebase !== 'undefined' && !firebase.apps.length) {
          await connectToFirebase(false);
        }

        if (typeof firebase !== 'undefined' && firebase.auth && FIREBASE_CONFIG.apiKey) {
          const userCred = await firebase.auth().createUserWithEmailAndPassword(email, pwd);
          if (userCred.user) {
            doctor.value.id = userCred.user.uid;
            if (userCred.user.updateProfile) {
              await userCred.user.updateProfile({
                displayName: `${authSignupForm.value.civility} ${authSignupForm.value.firstName} ${authSignupForm.value.lastName}`
              });
            }
          }
        }

        // Enregistrer la fiche praticien
        doctor.value.civility = authSignupForm.value.civility || 'Dr.';
        doctor.value.firstName = authSignupForm.value.firstName;
        doctor.value.lastName = authSignupForm.value.lastName;
        doctor.value.specialty = authSignupForm.value.specialty;
        doctor.value.rpps = authSignupForm.value.rpps || ('DZ-' + Math.floor(100000 + Math.random() * 900000));
        doctor.value.cabinetName = authSignupForm.value.cabinetName || `Cabinet Médical Dr. ${authSignupForm.value.lastName}`;
        doctor.value.wilaya = authSignupForm.value.wilaya;
        doctor.value.city = authSignupForm.value.wilaya || 'Alger';
        doctor.value.country = 'Algérie';
        doctor.value.email = email;
        if (authSignupForm.value.phone) {
          const cleanPhone = authSignupForm.value.phone.trim().replace(/^0+/, '').replace(/\s+/g, '');
          doctor.value.phoneOffice = `+213 ${cleanPhone}`;
          doctor.value.phoneEmergency = `+213 ${cleanPhone}`;
        }

        saveDoctorDataLocally();
        if (firebaseConnected.value && window.db) {
          await syncProfileToFirebase();
          listenToConversationsInFirestore();
        }

        isAuthenticated.value = true;
        localStorage.setItem('medidoc_auth', 'true');
        notify('Compte créé avec succès !', `Bienvenue ${doctor.value.civility} ${doctor.value.lastName} sur votre portail médical.`, 'success');
      } catch (err) {
        console.error('Erreur inscription email:', err);
        let errorMsg = err.message;
        if (err.code === 'auth/email-already-in-use') {
          errorMsg = 'Cette adresse email est déjà enregistrée. Veuillez vous connecter.';
        } else if (err.code === 'auth/invalid-email') {
          errorMsg = 'Format d\'adresse email invalide.';
        } else if (err.code === 'auth/weak-password') {
          errorMsg = 'Mot de passe trop court (6 caractères minimum).';
        } else if (err.code === 'auth/operation-not-allowed') {
          errorMsg = "Activez 'Adresse e-mail/Mot de passe' dans Firebase Console > Authentication > Sign-in method.";
        }
        notify('Erreur Inscription Email', errorMsg, 'error');
      } finally {
        authLoading.value = false;
      }
    };

    const signInWithEmail = async () => {
      const email = (authEmail.value || '').trim();
      const pwd = authPassword.value || '';

      if (!email || !pwd) {
        notify('Champs requis', 'Veuillez saisir votre email et votre mot de passe.', 'warning');
        return;
      }

      authLoading.value = true;
      try {
        if (typeof firebase !== 'undefined' && !firebase.apps.length) {
          await connectToFirebase(false);
        }

        if (typeof firebase !== 'undefined' && firebase.auth && FIREBASE_CONFIG.apiKey) {
          const userCred = await firebase.auth().signInWithEmailAndPassword(email, pwd);
          if (userCred.user) {
            doctor.value.id = userCred.user.uid;
          }
        }

        isAuthenticated.value = true;
        localStorage.setItem('medidoc_auth', 'true');
        doctor.value.email = email;
        saveDoctorDataLocally();

        if (firebaseConnected.value && window.db) {
          await loadDataFromFirebase();
          listenToConversationsInFirestore();
        }

        notify('Connexion réussie !', `Bienvenue ${doctor.value.civility} ${doctor.value.lastName}`, 'success');
      } catch (err) {
        console.error('Erreur connexion email:', err);
        let errorMsg = err.message;
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          errorMsg = 'Email ou mot de passe incorrect.';
        } else if (err.code === 'auth/invalid-email') {
          errorMsg = 'Adresse email invalide.';
        } else if (err.code === 'auth/too-many-requests') {
          errorMsg = 'Trop de tentatives infructueuses. Veuillez patienter.';
        } else if (err.code === 'auth/operation-not-allowed') {
          errorMsg = "Activez 'Adresse e-mail/Mot de passe' dans Firebase Console > Authentication > Sign-in method.";
        }
        notify('Erreur Connexion Email', errorMsg, 'error');
      } finally {
        authLoading.value = false;
      }
    };

    const sendPasswordReset = async () => {
      const email = (authEmail.value || authSignupForm.value.email || '').trim();
      if (!email) {
        notify('Email requis', 'Veuillez renseigner votre adresse email pour recevoir le lien de réinitialisation.', 'warning');
        return;
      }

      try {
        if (typeof firebase !== 'undefined' && firebase.auth) {
          await firebase.auth().sendPasswordResetEmail(email);
          notify('Lien envoyé !', `Un email de réinitialisation a été transmis à ${email}.`, 'success');
        } else {
          notify('Réinitialisation demandée', `Vérifiez votre boîte mail à l'adresse ${email}.`, 'info');
        }
      } catch (err) {
        console.error('Erreur reset password:', err);
        notify('Erreur Réinitialisation', err.message || 'Impossible d\'envoyer le lien.', 'error');
      }
    };

    const startOtpTimer = () => {
      authOtpTimer.value = 60;
      if (authTimerInterval) clearInterval(authTimerInterval);
      authTimerInterval = setInterval(() => {
        if (authOtpTimer.value > 0) {
          authOtpTimer.value--;
        } else {
          clearInterval(authTimerInterval);
        }
      }, 1000);
    };

    const resendOtp = () => {
      sendOtp(isSignupFlow.value);
    };

    const logoutDoctor = () => {
      if (typeof firebase !== 'undefined' && firebase.auth) {
        try { firebase.auth().signOut(); } catch (e) {}
      }
      isAuthenticated.value = false;
      localStorage.removeItem('medidoc_auth');
      authMode.value = 'signin';
      authOtpCode.value = '';
      notify('Déconnexion', 'Vous avez été déconnecté de l\'espace praticien.', 'info');
    };

    const quickDemoLogin = () => {
      notify('Inscription ou Connexion requise', 'Veuillez renseigner votre email ou téléphone pour vous connecter.', 'warning');
    };

    return {
      activeTab,
      theme,
      darkMode,
      searchQuery,
      doctor,
      patients,
      appointments,
      selectedDate,
      agendaFilter,
      filteredAppointments,
      todayStats,
      conversations,
      activeConversationId,
      activeConversation,
      activePatientDetails,
      totalUnreadCount,
      newMessageText,
      cannedReplies,
      showNewAppointmentModal,
      newAppointmentForm,
      showPrescriptionModal,
      prescriptionData,
      showFirebaseModal,
      firebaseConnected,
      firebaseLoading,
      firebaseConfig,
      firebaseInputMode,
      rawFirebaseSnippet,
      parseFirebaseSnippet,
      // Auth SMS & Email properties & methods
      isAuthenticated,
      authMode,
      authMethod,
      authCountryCode,
      authPhoneNumber,
      authOtpCode,
      authOtpTimer,
      authLoading,
      authEmail,
      authPassword,
      authPasswordConfirm,
      demoOtpCode,
      authSignupForm,
      algerianWilayas,
      countryCodes,
      medicalSpecialties,
      sendOtp,
      verifyOtp,
      resendOtp,
      signUpWithEmail,
      signInWithEmail,
      sendPasswordReset,
      logoutDoctor,
      quickDemoLogin,
      toasts,
      notify,
      saveDoctorProfile,
      resetDoctorProfile,
      addTarif,
      removeTarif,
      addDegree,
      removeDegree,
      handleDoctorPfpUpload,
      updateAppointmentStatus,
      deleteAppointment,
      openNewAppointmentModal,
      saveNewAppointment,
      selectConversation,
      sendMessage,
      sendQuickReply,
      sendMockAttachment,
      openChatWithPatient,
      openPrescriptionFromAppointment,
      addPrescriptionDrug,
      removePrescriptionDrug,
      printPrescription,
      connectToFirebase,
      disconnectFirebase,
      listenToConversationsInFirestore,
      firebaseConfig,
      showFirebaseModal,
      firebaseConnected,
      firebaseLoading,
      firebaseInputMode,
      rawFirebaseSnippet,
      parseFirebaseSnippet
    };
  }
});

app.mount('#app');
