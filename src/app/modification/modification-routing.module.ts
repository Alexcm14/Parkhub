import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificationPage } from './modification.page';

const routes: Routes = [
  {
    path: '',
    component: ModificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificationPageRoutingModule {}
