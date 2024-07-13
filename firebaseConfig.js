import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

//************************************************ */
// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "api-key",
//   authDomain: "project-id.firebaseapp.com",
//   databaseURL: "https://project-id.firebaseio.com",
//   projectId: "project-id",
//   storageBucket: "project-id.appspot.com",
//   messagingSenderId: "sender-id",
//   appId: "app-id",
// };
//************************************************ */

const firebaseConfig = {
  apiKey: "AIzaSyAZyvA1fI7VeM_Rzu8z3cD7m9XoIsB_fEs",

  authDomain: "wildeye-cam.firebaseapp.com",

  databaseURL: "https://wildeye-cam-default-rtdb.firebaseio.com",

  projectId: "wildeye-cam",

  storageBucket: "wildeye-cam.appspot.com",

  messagingSenderId: "959195615070",

  appId: "1:959195615070:web:6fd3afa8b365760851c9cf",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { initializeApp } from "firebase/app";
// import { getReactNativePersistence, initializeAuth } from "firebase/auth";

// // Your web app's Firebase configuration
// const firebaseConfig = {

//     apiKey: "AIzaSyAvg-8CG7zMvmf4mUCCwD6GgMM8NywH688",

//     authDomain: "wildeye-cam.firebaseapp.com",

//     databaseURL: "https://wildeye-cam-default-rtdb.firebaseio.com",

//     projectId: "wildeye-cam",

//     storageBucket: "wildeye-cam.appspot.com",

//     messagingSenderId: "846007896560",

//     appId: "1:846007896560:web:0d708d508226ecd25ff535"

// };

// const app = initializeApp(firebaseConfig);

// export const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage)
// });
