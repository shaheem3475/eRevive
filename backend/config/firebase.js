const admin = require('firebase-admin');

let firebaseApp = null;

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const projectId = process.env.FIREBASE_PROJECT_ID;

if (privateKey && clientEmail && projectId) {
    try {
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n')
            })
        });
        console.log('Firebase Admin SDK initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize Firebase Admin cert.', error.message);
    }
} else {
    console.error('Firebase environment variables missing (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).');
}

module.exports = {
    admin,
    firebaseApp
};
