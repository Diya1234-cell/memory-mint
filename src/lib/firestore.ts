import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseApp } from "@/lib/firebase";

const firebaseApp = getFirebaseApp();
const firestore = firebaseApp ? getFirestore(firebaseApp) : null;

export function getFirestoreClient(): Firestore | null {
  return firestore;
}

export function firestoreHelper(): Firestore | null {
  return firestore;
}
