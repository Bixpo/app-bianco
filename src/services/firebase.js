import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../config/configFirebase";


// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Obtenha a instância de autenticação
const auth = getAuth(app);

export { auth };
