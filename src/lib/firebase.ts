import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCsQ2s2W9pqg9HziMqrHUxVcIhXbNLD_UE',
  authDomain: 'studysphere-a2553.firebaseapp.com',
  projectId: 'studysphere-a2553',
  storageBucket: 'studysphere-a2553.firebasestorage.app',
  messagingSenderId: '96248323580',
  appId: '1:96248323580:web:2b7858bda5c09a5d622679',
  measurementId: 'G-YEZ5S8Y11P',
}

export const app: FirebaseApp = initializeApp(firebaseConfig)
export const auth: Auth = getAuth(app)
export const googleAuthProvider: GoogleAuthProvider = new GoogleAuthProvider()
export const storage: FirebaseStorage = getStorage(app)
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
