import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.page.html',
  styleUrls: ['./personal.page.scss'],
})
export class PersonalPage implements OnInit {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  registreNational: string;

  constructor(private authService: AuthService, private firestore: AngularFirestore) {}

  ngOnInit() {
    // Fetch logged-in user data
    this.authService.getLoggedInUserObservable().subscribe((userData) => {
      if (userData) {
        this.email = userData.email;
        this.motDePasse = userData.motDePasse;
        console.log('User is logged in:', this.email);
      } else {
        this.email = ''; 
        this.motDePasse = '';
        console.log('User is not logged in');
    
      }
    });
  }

  enregistrer() {

    if (this.nom && this.prenom && this.email && this.motDePasse && this.telephone && this.registreNational) {
      const user = {
        nom: this.nom,
        prenom: this.prenom,
        email: this.email,
        telephone: this.telephone,
    
      };

  
      this.firestore.collection('user_data').add(user)
        .then(() => {
          console.log('User added to Firestore successfully!');
        })
        .catch((error) => {
          console.error('Error adding user to Firestore: ', error);
        });
    } else {
      console.error('One or more required fields are undefined. User not added to Firestore.');
    }
  }
}
