import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import { getFirestore, type Firestore } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCsQ2s2W9pqg9HziMqrHUxVcIhXbNLD_UE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'studysphere-a2553.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'studysphere-a2553',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'studysphere-a2553.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '96248323580',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:96248323580:web:2b7858bda5c09a5d622679',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-YEZ5S8Y11P',
}

export const app: FirebaseApp = initializeApp(firebaseConfig)
export const auth: Auth = getAuth(app)
export const googleAuthProvider: GoogleAuthProvider = new GoogleAuthProvider()
export const db: Firestore = getFirestore(app)


let analytics: Analytics | null = null
void isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  })
  .catch(() => {
    analytics = null
  })

export { analytics }
