import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Config1PageRoutingModule } from './config1-routing.module';

import { Config1Page } from './config1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Config1PageRoutingModule
  ],
  declarations: [Config1Page]
})
export class Config1PageModule {}
