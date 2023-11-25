import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { from, of, switchMap, take } from 'rxjs';
 
@Component({
  selector: 'app-car',
  templateUrl: './car.page.html',
  styleUrls: ['./car.page.scss'],
})
export class CarPage {
  plaque: string = '';
  marque: string = '';
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
 
 
  vehicles: any[] = []; // Tableau pour stocker les véhicules

  constructor( private authService: AuthService, private firestore: AngularFirestore) {}

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
  
 
  ajouterVehicule() {
    // Logique pour récupérer les données du formulaire
    const nouveauVehicule = {
      plaque: this.plaque,
      marque: this.marque,
    };
 
    // Ajouter le nouveau véhicule au tableau
    this.vehicles.unshift(nouveauVehicule);
 
    // Réinitialiser les champs du formulaire
    this.plaque = '';
    this.marque = '';
  }
}