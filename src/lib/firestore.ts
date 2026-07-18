import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseApp } from "@/lib/firebase";

const firestore = getFirestore(getFirebaseApp());

export function getFirestoreClient(): Firestore {
  return firestore;
}

export function firestoreHelper(): Firestore {
  return firestore;
}
