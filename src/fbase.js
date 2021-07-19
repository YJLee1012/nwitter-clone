import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_API_KEY,
//     authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
//     appId: process.env.REACT_APP_APP_ID,
//   };
const firebaseConfig = {
  apiKey: "AIzaSyBNf_8-15ytI67oQ7lyRBzRCC1SqI1rqUw",
  authDomain: "nwitter-808b5.firebaseapp.com",
  projectId: "nwitter-808b5",
  storageBucket: "nwitter-808b5.appspot.com",
  messagingSenderId: "562027390591",
  appId: "1:562027390591:web:20830929cacf40e91a014a"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;

export const authService = firebase.auth();
export const dbService = firebase.firestore();