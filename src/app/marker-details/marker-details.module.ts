import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarkerDetailsPageRoutingModule } from './marker-details-routing.module';

import { MarkerDetailsPage } from './marker-details.page';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarkerDetailsPageRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    
  ],
  declarations: [MarkerDetailsPage]
})
export class MarkerDetailsPageModule {}
