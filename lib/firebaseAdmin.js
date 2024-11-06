// lib/firebaseAdmin.js
import admin from 'firebase-admin';

const serviceAccount = require('../serviceAccountKey.json');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // Use your environment variable
  });
  console.log("Firebase Admin SDK initialized.");
}

export const database = admin.database();
