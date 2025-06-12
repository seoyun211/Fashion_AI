
// src/firebase/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 웹 앱용 Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyBYMmXdulLebeIofbeVeLT2Q9EN3cK7NHY",
  authDomain: "fashion-ai-f0e5e.firebaseapp.com",
  databaseURL: "https://fashion-ai-f0e5e-default-rtdb.firebaseio.com",
  projectId: "fashion-ai-f0e5e",
  storageBucket: "fashion-ai-f0e5e.appspot.com",
  messagingSenderId: "106166089685",
  appId: "1:106166089685:web:54cf38622a681126246f5c",
  measurementId: "G-H2Q98GWQ3N"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스들
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
