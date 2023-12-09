import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrixPageRoutingModule } from './prix-routing.module';

import { PrixPage } from './prix.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrixPageRoutingModule
  ],
  declarations: [PrixPage]
})
export class PrixPageModule {}
