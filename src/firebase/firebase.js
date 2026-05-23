import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDyBWSnWEge_WWD0SkXc2m1eWKdK_o5iJs",
  authDomain: "fixture-mundial2026.firebaseapp.com",
  projectId: "fixture-mundial2026",
  storageBucket: "fixture-mundial2026.firebasestorage.app",
  messagingSenderId: "1077734829906",
  appId: "1:1077734829906:web:86eceea0f7391753c5948b"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)