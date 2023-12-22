import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificationPageRoutingModule } from './modification-routing.module';

import { ModificationPage } from './modification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificationPageRoutingModule
  ],
  declarations: [ModificationPage]
})
export class ModificationPageModule {}
