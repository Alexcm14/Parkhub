import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OubliPageRoutingModule } from './oubli-routing.module';

import { OubliPage } from './oubli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OubliPageRoutingModule
  ],
  declarations: [OubliPage]
})
export class OubliPageModule {}
