import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Firebase Configuration using Environment Variables
// Firestore automatically creates collections when data is added.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize primary Firebase app
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize a SECONDARY Firebase app exclusively for user creation.
// This is necessary so that creating a new Firebase Auth account does NOT
// sign out the currently-logged-in admin on the primary app.
const SECONDARY_APP_NAME = 'rhive-secondary';
const appSecondary: FirebaseApp =
    getApps().find(a => a.name === SECONDARY_APP_NAME) ??
    initializeApp(firebaseConfig, SECONDARY_APP_NAME);

// Initialize Firebase services
let analytics: Analytics | null = null;
let auth: Auth;
let authSecondary: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// Analytics only works in browser environment and may fail gracefully
if (typeof window !== 'undefined') {
    try {
        analytics = getAnalytics(app);
    } catch (e) {
        console.warn('Firebase Analytics not available:', e);
    }
}

// Initialize other services
auth = getAuth(app);
authSecondary = getAuth(appSecondary);
db = getFirestore(app);
storage = getStorage(app);

// Export initialized services
export { app, appSecondary, analytics, auth, authSecondary, db, storage };
