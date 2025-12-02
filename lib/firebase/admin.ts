import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!raw) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");

const serviceAccount = JSON.parse(raw);

const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount) });
export const db = getFirestore(app);
