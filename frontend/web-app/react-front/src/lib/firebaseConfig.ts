import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBk160kmhmlvMYwHG1d4tEGB3CHQNpty-A",
  authDomain: "iot-patient-monitoring-s-8a328.firebaseapp.com",
  projectId: "iot-patient-monitoring-s-8a328",
  storageBucket: "iot-patient-monitoring-s-8a328.firebasestorage.app",
  messagingSenderId: "200007699313",
  appId: "1:200007699313:web:8f010fd63aa47e5cef04d0",
  measurementId: "G-8GP2QZCTH0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

setPersistence(auth, browserLocalPersistence) 
  .catch((error) => {
    console.error("Error setting persistence: ", error);
});

export { analytics };
export { firebaseConfig };
export { auth };