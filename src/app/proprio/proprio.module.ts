import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProprioPageRoutingModule } from './proprio-routing.module';

import { ProprioPage } from './proprio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProprioPageRoutingModule
  ],
  declarations: [ProprioPage]
})
export class ProprioPageModule {}
