const admin = require("firebase-admin");

let firebaseApp;

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log("Firebase initialized ✅");

} catch (err) {
  console.log("Firebase not initialized ❌", err.message);
}

module.exports = admin;