import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProprioPage } from './proprio.page';

const routes: Routes = [
  {
    path: '',
    component: ProprioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProprioPageRoutingModule {}
