import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarkerDetailsPageRoutingModule } from './marker-details-routing.module';

import { MarkerDetailsPage } from './marker-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarkerDetailsPageRoutingModule
  ],
  declarations: [MarkerDetailsPage]
})
export class MarkerDetailsPageModule {}
