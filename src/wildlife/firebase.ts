import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth, db, googleProvider } from "../firebase";

// Reuses the Firebase setup from src/firebase.ts (the login one)
export { auth, db };

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);

// The signed-in user (null when signed out); `ready` is false until Firebase has checked
export const useAuthUser = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [ready, setReady] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        setReady(true);
      }),
    [],
  );

  return { user, ready };
};
