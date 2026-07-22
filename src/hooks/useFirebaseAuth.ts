import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  loginWithEmail,
  signupWithEmail,
  logout as authLogout,
} from "@/services/authService";

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    const firebaseAuth = auth;
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      // Firebase can deliver the initial null snapshot while a sign-in is
      // completing. Prefer the current session in that case so it cannot
      // overwrite a successful login with a logged-out state.
      setUser(firebaseUser ?? firebaseAuth.currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const result = await loginWithEmail(email, password);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const signup = async (email: string, password: string, name?: string) => {
    const result = await signupWithEmail(email, password, name);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => authLogout();

  return { user, loading, login, signup, logout };
}
