import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

const FIREBASE_UNAVAILABLE_MESSAGE =
  "Authentication is not configured. Add the Firebase web app values to .env.local and restart the app.";

function getAuthErrorMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error
    ? String(error.code)
    : "";

  const messages: Record<string, string> = {
    "auth/invalid-email": "Enter a valid email address.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/user-not-found": "Incorrect email or password.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/email-already-in-use": "An account already exists for this email address.",
    "auth/weak-password": "Use a password with at least 6 characters.",
    "auth/operation-not-allowed": "Email/password sign-in is not enabled for this Firebase project.",
    "auth/network-request-failed": "Network error. Check your connection and try again.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  };

  return messages[code] ?? "Authentication failed. Please try again.";
}

// Use this for the Login page
export const loginWithEmail = async (email: string, password: string) => {
  if (!auth) {
    return { user: null, error: FIREBASE_UNAVAILABLE_MESSAGE };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    return { user: null, error: getAuthErrorMessage(error) };
  }
};

// Use this for the Signup page
export const signupWithEmail = async (email: string, password: string, name?: string) => {
  if (!auth) {
    return { user: null, error: FIREBASE_UNAVAILABLE_MESSAGE };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    return { user: null, error: getAuthErrorMessage(error) };
  }
};

export const logout = async () => {
  if (!auth) {
    return;
  }

  await signOut(auth);
};
