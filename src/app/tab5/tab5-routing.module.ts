import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab5Page } from './tab5.page';

const routes: Routes = [
  {
    path: '',
    component: Tab5Page
  }
];
{
  path: 'personal'
  loadChildren: () => import('../pages/personal/personal.module').then(m => m.PersonalPageModule)
};

{
  path: 'car'
  loadChildren: () => import('../car/car.module').then(m => m.CarPageModule)
};
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab5PageRoutingModule {}
