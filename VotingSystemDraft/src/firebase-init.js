import firebase from "firebase";
import config from "./firebase-config";

const firebaseInstance = firebase.initializeApp(config, "moodi-voting-system");

const settings = { timestampsInSnapshots: true };

const db = firebaseInstance.firestore();
db.settings(settings);

export { db };
