import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase-config";

const useAuth = create(persist((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => {
    auth.signOut();
    set({ user: null });
  },
}), {
  name: 'user-auth',
}));

export const AuthStateObserver = () => {
  const { login, logout } = useAuth();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Aquí se maneja el estado de login, ajustando según sea necesario para tu aplicación.
        login(user);
      } else {
        // Aquí se maneja el estado de logout.
        logout();
      }
    });
    return () => unsubscribe();
  }, [login, logout]);

  return null; // Este componente no renderiza nada visualmente.
};

export default useAuth;
