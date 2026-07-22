import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFirebaseApp } from "@/lib/firebase";

const firebaseApp = getFirebaseApp();
const storage = firebaseApp ? getStorage(firebaseApp) : null;

export function getFirebaseStorage(): FirebaseStorage | null {
  return storage;
}

export function storageHelper(): FirebaseStorage | null {
  return storage;
}
