import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartesPage } from './cartes.page';

const routes: Routes = [
  {
    path: '',
    component: CartesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartesPageRoutingModule {}
