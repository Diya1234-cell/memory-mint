import { getAuth, type Auth } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase";

const auth = getAuth(getFirebaseApp());

export function getFirebaseAuth(): Auth {
  return auth;
}

export function authHelper(): Auth {
  return auth;
}
