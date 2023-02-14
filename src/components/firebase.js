// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyDwh3gozA0xQfcmrmKjhxrih_lnUTrG7B0",

    authDomain: "trivia-time-14d4f.firebaseapp.com",

    projectId: "trivia-time-14d4f",

    storageBucket: "trivia-time-14d4f.appspot.com",

    messagingSenderId: "461194120616",

    appId: "1:461194120616:web:62a7ebf39c7ed2b396a19d"

};


// Initialize Firebase

const firebase = initializeApp(firebaseConfig);

export default firebase;