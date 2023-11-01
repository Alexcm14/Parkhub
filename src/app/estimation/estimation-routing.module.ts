import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstimationPage } from './estimation.page';

const routes: Routes = [
  {
    path: '',
    component: EstimationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstimationPageRoutingModule {}
