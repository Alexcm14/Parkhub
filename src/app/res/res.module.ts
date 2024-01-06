import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResPageRoutingModule } from './res-routing.module';

import { ResPage } from './res.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResPageRoutingModule
  ],
  declarations: [ResPage]
})
export class ResPageModule {}
