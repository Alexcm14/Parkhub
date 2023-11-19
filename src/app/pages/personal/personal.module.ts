import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';


import { PersonalPageRoutingModule } from './personal-routing.module';

import { PersonalPage } from './personal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularFirestoreModule,
    PersonalPageRoutingModule
  ],
  declarations: [PersonalPage],
})
export class PersonalPageModule {}
