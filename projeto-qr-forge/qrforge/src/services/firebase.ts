import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, collection, query, onSnapshot, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function logout() {
  await signOut(auth);
}

// Critical: Connection test
async function testConnection() {
  try {
    // Attempting a read to verify connection/config
    await getDocFromServer(doc(db, 'system', 'ping'));
  } catch (error: any) {
    // Both string check and code check for cross-browser/version robustness
    const isPermissionError = 
      error?.code === 'permission-denied' || 
      error?.message?.toLowerCase().includes('permission') ||
      error?.message?.toLowerCase().includes('permissions');

    if (isPermissionError) {
      // This is actually good - it means we reached the server and rules blocked us
      // as intended by the default-deny policy.
      console.log("Firebase connection established (Secure).");
    } else {
      console.error("Firebase connection error:", error);
    }
  }
}

testConnection();
