import firebase from 'firebase';

const firebaseConfig = {
    apiKey: 'AIzaSyAu4_nQcMRTIoYz2U1kbix7epdRGBU4cx0',
    authDomain: 'drive-clone-456.firebaseapp.com',
    projectId: 'drive-clone-456',
    storageBucket: 'drive-clone-456.appspot.com',
    messagingSenderId: '612999858179',
    appId: '1:612999858179:web:ce0b7350076a44ea30a636',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const githubProvider = new firebase.auth.GithubAuthProvider();
const storage = firebase.storage();
const db = firebaseApp.firestore();

export { auth, provider, db, storage, githubProvider };
