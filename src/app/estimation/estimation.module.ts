import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstimationPageRoutingModule } from './estimation-routing.module';

import { EstimationPage } from './estimation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstimationPageRoutingModule
  ],
  declarations: [EstimationPage]
})
export class EstimationPageModule {}
