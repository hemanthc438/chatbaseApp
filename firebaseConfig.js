// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getReactNativePersistence, initializeAuth} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {getFirestore, collection} from 'firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBojZKUulN9mqI5UFX27ZakwRm8CbR5Hho",
  authDomain: "chat07app.firebaseapp.com",
  projectId: "chat07app",
  storageBucket: "chat07app.appspot.com",
  messagingSenderId: "370575073469",
  appId: "1:370575073469:web:98744ae58a35950e8c57d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app,{
    persistence : getReactNativePersistence(AsyncStorage)
})

export const db = getFirestore(app)

export const usersref = collection(db, 'users')
export const roomsref = collection(db, 'rooms')