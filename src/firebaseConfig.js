import firebase from 'firebase'
import 'firebase/storage'
import 'firebase/database'

var config = {
   apiKey: "AIzaSyBI13TKjc4WD4Riq9uTRVzileI-0cPsw-w",
   authDomain: "myiot-41369.firebaseapp.com",
   databaseURL: "https://myiot-41369.firebaseio.com",
   projectId: "myiot-41369",
   storageBucket: "myiot-41369.appspot.com",
   messagingSenderId: "201145539454"
 };

 firebase.initializeApp(config);


const storage = firebase.storage();
const database = firebase.database();
const auth = firebase.auth();
const currentUser = auth.currentUser;

const authConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return false;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      // document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  // signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    // {
    //   provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //   requireDisplayName: false
    // },
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      customParameters: {
        // Forces account selection even when one account
        // is available.
        prompt: 'select_account'
      }
    }
  ]
};
//
//


export {
  authConfig,
  auth,
  currentUser,
  storage,
  database
}
