import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFirebaseApp } from "@/lib/firebase";

const storage = getStorage(getFirebaseApp());

export function getFirebaseStorage(): FirebaseStorage {
  return storage;
}

export function storageHelper(): FirebaseStorage {
  return storage;
}
