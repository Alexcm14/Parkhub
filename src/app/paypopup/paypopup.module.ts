import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaypopupPageRoutingModule } from './paypopup-routing.module';

import { PaypopupPage } from './paypopup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaypopupPageRoutingModule
  ],
  declarations: [PaypopupPage]
})
export class PaypopupPageModule {}
