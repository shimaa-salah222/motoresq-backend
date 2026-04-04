let admin;
let firebaseInitialized = false;

try {
  admin = require("firebase-admin");

  if (process.env.FIREBASE_CONFIG) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    firebaseInitialized = true;
    console.log("Firebase initialized ✅");
  } else {
    console.log("Firebase config not found ❌");
  }

} catch (error) {
  console.log("Firebase error ❌", error.message);
}

module.exports = { admin, firebaseInitialized };