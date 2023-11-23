import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';

import { provideStorage, getStorage } from '@angular/fire/storage';



@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
    AngularFireModule, 
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
		provideAuth(() => getAuth()),
		provideFirestore(() => getFirestore()),
		provideStorage(() => getStorage())
  ],


  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
