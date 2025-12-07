import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "node:fs";
import path from "node:path";

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

const filePath = path.join(process.cwd(), "firebase.json");
if (!fs.existsSync(filePath)) {
  throw new Error("firebase.json not found in project root.");
}

const serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8")) as ServiceAccount;

// ensure key is valid even if stored with \\n (some people do that)
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
  throw new Error("firebase.json is missing project_id/client_email/private_key");
}

const app =
  getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: serviceAccount.private_key,
        }),
      });

export const db = getFirestore(app);
