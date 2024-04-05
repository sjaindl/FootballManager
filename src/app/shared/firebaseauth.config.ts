import { firebase, firebaseui } from 'firebaseui-angular';

export const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    {
      scopes: ['profile', 'email'],
      customParameters: {
        auth_type: 'reauthenticate',
      },
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    },
    {
      scopes: ['public_profile', 'email'],
      customParameters: {
        auth_type: 'reauthenticate',
      },
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    },
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  privacyPolicyUrl: 'https://starting-eleven-2019.firebaseapp.com/#/privacy',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};
