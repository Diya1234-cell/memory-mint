import { getAuth, type Auth } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase";

const firebaseApp = getFirebaseApp();
const auth = firebaseApp ? getAuth(firebaseApp) : null;

export function getFirebaseAuth(): Auth | null {
  return auth;
}

export function authHelper(): Auth | null {
  return auth;
}
