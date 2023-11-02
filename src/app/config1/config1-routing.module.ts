import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Config1Page } from './config1.page';

const routes: Routes = [
  {
    path: '',
    component: Config1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Config1PageRoutingModule {}
