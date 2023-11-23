import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PersonalPageModule } from './pages/personal/personal.module';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';
import { CanActivate } from '@angular/router';
import { AuthGuard } from '../app/services/auth.guard';



// Automatically log in users
const redirectLoggedInToChat = () => redirectLoggedInTo(['/tab1']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    
  },
  {
    path : '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
   
    
  },
  {
    path: 'personal',
    loadChildren: () => import('./pages/personal/personal.module').then( m => m.PersonalPageModule),
    
  },
  {
    path: 'estimation',
    loadChildren: () => import('./estimation/estimation.module').then( m => m.EstimationPageModule)
  },
  {
    path: 'annonces',
    loadChildren: () => import('./annonces/annonces.module').then( m => m.AnnoncesPageModule)
  },
  {
    path: 'config1',
    loadChildren: () => import('./config1/config1.module').then( m => m.Config1PageModule)
  },
  {
    path: 'localisation',
    loadChildren: () => import('./localisation/localisation.module').then( m => m.LocalisationPageModule)
  },
  {
    path: 'nbplaces',
    loadChildren: () => import('./nbplaces/nbplaces.module').then( m => m.NbplacesPageModule)
  },
  {
    path: 'description',
    loadChildren: () => import('./description/description.module').then( m => m.DescriptionPageModule)
  },
  {
    path: 'car',
    loadChildren: () => import('./car/car.module').then( m => m.CarPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'oubli',
    loadChildren: () => import('./pages/oubli/oubli.module').then( m => m.OubliPageModule)
  },
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
