import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../services/firebase";
import {
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";

// Crie um contexto de autenticação
const AuthContext = createContext();

// Crie um componente de provedor para encapsular o aplicativo com o contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para fazer login com e-mail e senha
  const signIn = async (email, password) => {
    try {
      await firebaseSignInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  // Função para fazer logout
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Retorne o contexto de autenticação
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signIn,
        signOut,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Função de gancho personalizada para acessar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);
