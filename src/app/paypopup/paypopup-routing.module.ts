import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaypopupPage } from './paypopup.page';

const routes: Routes = [
  {
    path: '',
    component: PaypopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaypopupPageRoutingModule {}
