import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// These values are safe to have in your code: Firebase web config is public by design
const firebaseConfig = {
  apiKey: "AIzaSyCKFwqhldFIuIwasOdJWG4WyipG8X_WNpc",
  authDomain: "learnandhelpanimals-1cfad.firebaseapp.com",
  projectId: "learnandhelpanimals-1cfad",
  storageBucket: "learnandhelpanimals-1cfad.firebasestorage.app",
  messagingSenderId: "1068247843049",
  appId: "1:1068247843049:web:3da1d33e032548e15cf078",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
