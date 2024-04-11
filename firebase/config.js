import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: "was-muxt.firebaseapp.com",
    projectId: "was-muxt",
    storageBucket: "was-muxt.appspot.com",
    messagingSenderId: "771377893677",
    appId: "1:771377893677:web:5420ec2edf0cfdb60f03a4"
  };

// Initialize Firebase App
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//Collection Refs
const ordersColRef = collection(db, 'orders')
const statusesColRef = collection(db, 'statuses')
const usersColRef = collection(db, 'users')




export { db, ordersColRef, statusesColRef, usersColRef }
