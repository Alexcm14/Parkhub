import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NbplacesPageRoutingModule } from './nbplaces-routing.module';

import { NbplacesPage } from './nbplaces.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NbplacesPageRoutingModule
  ],
  declarations: [NbplacesPage]
})
export class NbplacesPageModule {}
