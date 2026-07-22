import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

const FIREBASE_UNAVAILABLE_MESSAGE = "Firebase is not configured in this environment.";

// Use this for the Login page
export const loginWithEmail = async (email: string, password: string) => {
  if (!auth) {
    return { user: null, error: FIREBASE_UNAVAILABLE_MESSAGE };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Use this for the Signup page
export const signupWithEmail = async (email: string, password: string) => {
  if (!auth) {
    return { user: null, error: FIREBASE_UNAVAILABLE_MESSAGE };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const logout = async () => {
  if (!auth) {
    return;
  }

  await signOut(auth);
};
