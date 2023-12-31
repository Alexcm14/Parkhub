import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SharedService } from '../shared.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { from, of, switchMap, take } from 'rxjs';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  valeur: number = 1;
  somme: number = 20;

   
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  

  constructor(private navCtrl: NavController, private sharedService: SharedService, private authService: AuthService, private firestore: AngularFirestore) { }

  ngOnInit() {
    // Fetch logged-in user data
    this.authService.getLoggedInUserObservable().pipe(
      switchMap((userData) => {
        console.log('Raw userData:', userData);
  
        if (userData) {
          this.email = userData.email;
          this.motDePasse = userData.motDePasse;
          console.log('User is logged in:', this.email, this.authService.uid);
  
          // Connecte le UID et EMAIL
          console.log('Logged-in UID:', this.authService.uid);
          console.log('Logged-in Email:', this.email);
  
          // Retourne les données supplémentaires de Firestore
          return this.firestore.collection('user_data').doc(this.authService.uid).valueChanges();
        } else {
          this.email = '';
          this.motDePasse = '';
          console.log('User is not logged in');
          return from([]); // Chaîne qui continue
        }
      }),
      take(1)
    ).subscribe((additionalData: any) => {
      console.log('Processed additionalData:', additionalData);
  
      if (additionalData) {
        this.nom = additionalData.nom;
        this.prenom = additionalData.prenom;
        this.telephone = additionalData.telephone;
      } else {
        console.log('User data not found in Firestore.');
      }
    });
  }
  afficherEstimation() {
    this.sharedService.nombrePlaces;
    this.navCtrl.navigateForward('/estimation');
  }

  calculerSomme() {
    this.somme = this.valeur * 20 * this.sharedService.nombrePlaces;
  }

  redirigerVersAnnonces() {
    this.navCtrl.navigateForward('/annonces');
  }




 
}
