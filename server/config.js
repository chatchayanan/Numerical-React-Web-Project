const firebase=require('firebase');
const firebaseConfig = {
    apiKey: "AIzaSyCpBVgIr8rBQPzVhKEcpFYRuLrCjUwDpoM",
    authDomain: "numer-project.firebaseapp.com",
    projectId: "numer-project",
    storageBucket: "numer-project.appspot.com",
    messagingSenderId: "964138712140",
    appId: "1:964138712140:web:c9430a21fb4e0c9c3648e9",
    measurementId: "G-P557X7YQE3"
  };
firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();
module.exports=db;