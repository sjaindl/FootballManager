import { FirebaseConfig } from "../app/shared/firebase.config";

export const environment = {
  firebase: {
    apiKey: FirebaseConfig.apiKey,
    authDomain: FirebaseConfig.authDomain,
    databaseURL: FirebaseConfig.databaseURL,
    projectId: "footballmanager-a2019",
    storageBucket: FirebaseConfig.storageBucket,
    messagingSenderId: FirebaseConfig.messagingSenderId
  }
};
