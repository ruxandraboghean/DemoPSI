// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  User,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { create } from "zustand";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhsit-Ti2TbQ0Yy4NGBhXJ0aDTOhwkR9Y",
  authDomain: "psidemo-55e06.firebaseapp.com",
  projectId: "psidemo-55e06",
  storageBucket: "psidemo-55e06.appspot.com",
  messagingSenderId: "83090741300",
  appId: "1:83090741300:web:e23b3cf9b1e8f7c6a7d261",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

auth.onAuthStateChanged((state) => {
  useAuth.setState({ user: state });
});

interface AuthState {
  user: User | null | "loading";
}

export async function signIn() {
  const provider = new GoogleAuthProvider();
  const authData = await signInWithPopup(auth, provider);

  if (authData.user) useAuth.setState({ user: authData.user });
}

export function signOut() {
  auth.signOut();
}

export const useAuth = create<AuthState>(() => ({
  user: "loading",
}));

// requests: [{ type: "Team" }, { type: "Employer" }];
