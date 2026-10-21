// firebase-config.js - Configuration Firebase directe du projet MEDOC
const firebaseConfig = {
  apiKey: "AIzaSyAQVFcEt7M5_OymrE39l_wyWyqosJZPc6g",
  authDomain: "drzone-ad80f.firebaseapp.com",
  projectId: "drzone-ad80f",
  storageBucket: "drzone-ad80f.firebasestorage.app",
  messagingSenderId: "192555399893",
  appId: "1:192555399893:web:340ea11953c93d5adc805c"
};

window.firebaseConfig = firebaseConfig;

// Helper global pour initialiser Firestore sur la base de données 'default' de drzone-ad80f
window.getMedidocFirestore = function() {
  if (typeof firebase === 'undefined') return null;
  if (!firebase.apps.length) {
    try {
      firebase.initializeApp(firebaseConfig);
    } catch (e) {}
  }
  try {
    const db = firebase.firestore();
    if (db && db._delegate && db._delegate._databaseId) {
      db._delegate._databaseId.database = 'default';
    }
    return db;
  } catch (err) {
    console.warn('Erreur init Firestore:', err);
    return null;
  }
};

// Initialisation automatique
if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    try {
      firebase.initializeApp(firebaseConfig);
      console.log('Firebase drzone-ad80f initialisé avec succès !');
    } catch (err) {
      console.warn('Initialisation automatique différée:', err);
    }
  }
  window.db = window.getMedidocFirestore();
}
