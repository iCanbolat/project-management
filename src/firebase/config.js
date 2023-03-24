import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAWxFOUTjfp1c8J6c9qcRZlIp5_OEasX9Q",
  authDomain: "fir-project-31d96.firebaseapp.com",
  projectId: "fir-project-31d96",
  storageBucket: "fir-project-31d96.appspot.com",
  messagingSenderId: "1044616187605",
  appId: "1:1044616187605:web:b5cedef91ae9ef87bbdc5c",
};

// init firebase
firebase.initializeApp(firebaseConfig)

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

// timestamp
const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth,projectStorage, timestamp }