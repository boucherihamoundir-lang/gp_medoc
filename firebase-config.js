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

// Initialisation automatique directe dans le code
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase drzone-ad80f initialisé directement dans le code !');
  } catch (err) {
    console.warn('Initialisation automatique différée:', err);
  }
}
