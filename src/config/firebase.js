const admin = require("firebase-admin");

let firebaseInitialized = false;

try {
  if (process.env.FIREBASE_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    firebaseInitialized = true;
    console.log("Firebase initialized ✅");
  }
} catch (err) {
  console.log("Firebase error ❌", err.message);
}

module.exports = { admin, firebaseInitialized };