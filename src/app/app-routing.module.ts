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
    path: 'recapitulatif',
    loadChildren: () => import('./recapitulatif/recapitulatif.module').then( m => m.RecapitulatifPageModule)
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
  {
    path: 'pay',
    loadChildren: () => import('./pay/pay.module').then( m => m.PayPageModule)
  },
  {
    path: 'paypopup',
    loadChildren: () => import('./paypopup/paypopup.module').then( m => m.PaypopupPageModule)
  },
  {
    path: 'tab3',
    loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3PageModule)
  },
  {
    path: 'marker-details',
    loadChildren: () => import('./marker-details/marker-details.module').then( m => m.MarkerDetailsPageModule)
  },
  {
    path: 'prix',
    loadChildren: () => import('./prix/prix.module').then( m => m.PrixPageModule)
  },
  {
    path: 'cartes',
    loadChildren: () => import('./cartes/cartes.module').then( m => m.CartesPageModule)
  },
  {
    path: 'modification/:id',
    loadChildren: () => import('./modification/modification.module').then( m => m.ModificationPageModule)
  },  
  {
    path: 'res',
    loadChildren: () => import('./res/res.module').then( m => m.ResPageModule)
  },
  {
    path: 'proprio',
    loadChildren: () => import('./proprio/proprio.module').then( m => m.ProprioPageModule)
  },  {
    path: 'conditions',
    loadChildren: () => import('./conditions/conditions.module').then( m => m.ConditionsPageModule)
  },

  



  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
