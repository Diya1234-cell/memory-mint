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

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email: string, password: string) =>
    loginWithEmail(email, password);

  const signup = (email: string, password: string) =>
    signupWithEmail(email, password);

  const logout = () => authLogout();

  return { user, loading, login, signup, logout };
}
