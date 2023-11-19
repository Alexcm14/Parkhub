import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OubliPage } from './oubli.page';

const routes: Routes = [
  {
    path: '',
    component: OubliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OubliPageRoutingModule {}
