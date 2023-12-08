import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartesPageRoutingModule } from './cartes-routing.module';

import { CartesPage } from './cartes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartesPageRoutingModule
  ],
  declarations: [CartesPage]
})
export class CartesPageModule {}
