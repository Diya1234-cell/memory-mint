import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

function getConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

function hasMinimalConfig(): boolean {
  const { apiKey, authDomain, projectId } = getConfig();
  return [apiKey, authDomain, projectId].every(
    (v) => typeof v === "string" && v.trim().length > 0
  );
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

let initialized = false;

export function initFirebase(): void {
  if (initialized) return;
  initialized = true;

  if (!hasMinimalConfig()) return;

  const config = getConfig();

  try {
    app = getApps().length > 0 ? getApp() : initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch {
    app = null;
    auth = null;
    db = null;
    storage = null;
  }
}

initFirebase();

export const isFirebaseConfigured = Boolean(app);
export { auth, db, storage };

export function getFirebaseApp(): FirebaseApp | null {
  return app;
}

export default app;
