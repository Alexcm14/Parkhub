import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PersonalPageModule } from './pages/personal/personal.module';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'personal',
    loadChildren: () => import('./pages/personal/personal.module').then( m => m.PersonalPageModule)
  },
  {
    path: 'estimation',
    loadChildren: () => import('./estimation/estimation.module').then( m => m.EstimationPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
