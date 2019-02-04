import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { SignUpPage } from 'presentations/components/SignUpPage';
import { firebaseApp } from 'presentations/utils/firebaseApp';
import { firebaseAuth } from 'presentations/utils/firebaseAuth';

firebaseApp.init();
firebaseAuth.init();
firebaseApp.onAuthStateChanged(async (user: firebase.User) => {
  const idToken: string = await user.getIdToken();
  firebaseAuth.setSession(idToken);
});

window.addEventListener('DOMContentLoaded', () => {
  const el: HTMLElement = window.document.querySelector('.application');
  ReactDOM.render(React.createElement(SignUpPage), el);
});
