import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAk3RDdNOPDiOzie1vbcNW0dVBeravUxrc",
  authDomain: "clipscript.firebaseapp.com",
  projectId: "clipscript",
  storageBucket: "clipscript.appspot.com",
  messagingSenderId: "813275162958",
  appId: "1:813275162958:web:cef67b29a293ce427f961f",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
// const analytics = !getApps().length ? getAnalytics(app) : getApp();

export default app;
export { db, storage };
