import app from 'firebase/app'
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDc6g1_okvwL1o5TH4HfhBpeVZXpY7xGBk",
  authDomain: "rnfinal-dfb50.firebaseapp.com",
  projectId: "rnfinal-dfb50",
  storageBucket: "rnfinal-dfb50.firebasestorage.app",
  messagingSenderId: "555474095289",
  appId: "1:555474095289:web:d709f582626de9bd7f5f68"
};


 app.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const storage = app.storage();
export const db = app.firestore();