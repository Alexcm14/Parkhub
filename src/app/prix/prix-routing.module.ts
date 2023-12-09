import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrixPage } from './prix.page';

const routes: Routes = [
  {
    path: '',
    component: PrixPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrixPageRoutingModule {}
