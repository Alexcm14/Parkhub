import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnnoncesPage } from './annonces.page';

const routes: Routes = [
  {
    path: '',
    component: AnnoncesPage
  }
];
{
  path: 'res'
  loadChildren: () => import('../res/res.module').then(m => m.ResPageModule)
};

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnoncesPageRoutingModule {}
