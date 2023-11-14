import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializeApp } from "firebase/app";

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const firebaseConfig = {
  apiKey: "AIzaSyBnNRxlE10F7jEOUL1YE1LMTz4jWyUgAGY",
  authDomain: "parkhub-1.firebaseapp.com",
  projectId: "parkhub-1",
  storageBucket: "parkhub-1.appspot.com",
  messagingSenderId: "320325168213",
  appId: "1:320325168213:web:053c6e0b4df3ff050978dc"
};

const app = initializeApp(firebaseConfig);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
