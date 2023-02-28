import { initializeApp } from "firebase/app";

const firebaseConfig = {

    apiKey: "AIzaSyDwh3gozA0xQfcmrmKjhxrih_lnUTrG7B0",

    authDomain: "trivia-time-14d4f.firebaseapp.com",

    projectId: "trivia-time-14d4f",

    storageBucket: "trivia-time-14d4f.appspot.com",

    messagingSenderId: "461194120616",

    appId: "1:461194120616:web:62a7ebf39c7ed2b396a19d"

};

const firebase = initializeApp(firebaseConfig);

export default firebase;