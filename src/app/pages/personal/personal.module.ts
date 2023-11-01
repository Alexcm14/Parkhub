

import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PersonalPage } from './personal.page';
import { PersonalPageRoutingModule } from './personal-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  declarations: [PersonalPage], // Add other components, directives, or pipes if needed
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PersonalPageRoutingModule,
    IonicStorageModule.forRoot() // Add this line to configure Storage
  ],
})
export class PersonalPageModule {}
