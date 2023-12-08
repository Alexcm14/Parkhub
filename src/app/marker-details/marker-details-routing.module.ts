import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarkerDetailsPage } from './marker-details.page';

const routes: Routes = [
  {
    path: '',
    component: MarkerDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarkerDetailsPageRoutingModule {}
