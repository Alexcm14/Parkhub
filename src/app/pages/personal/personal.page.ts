import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, of, switchMap, take } from 'rxjs';
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

  constructor(private authService: AuthService, private firestore: AngularFirestore) {}

  ngOnInit() {
    // Fetch logged-in user data
    this.authService.getLoggedInUserObservable().pipe(
      switchMap((userData) => {
        console.log('Raw userData:', userData);
  
        if (userData) {
          this.email = userData.email;
          this.motDePasse = userData.motDePasse;
          console.log('User is logged in:', this.email, this.authService.uid);
  
          
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
  

  
  enregistrer() {
    if (this.nom && this.prenom && this.email && this.telephone) {
      // récupèrer l'observable utilisateur
      const userObservable = this.authService.getLoggedInUserObservable();

      // obtenir les données utilisateur
      userObservable.pipe(take(1)).subscribe((userData) => {
        if (userData) {
          const userId = this.authService.uid || userData['uid']; // Access the UID property

          console.log('User ID:', userId);

          if (userId) {
            const user = {
              nom: this.nom,
              prenom: this.prenom,
              email: this.email,
              telephone: this.telephone,
            };

            const userDocRef = this.firestore.collection('user_data').doc(userId);

            // l'utilisateur existe dans firestore?
            userDocRef.get().subscribe((doc: any) => {
              if (doc.exists) {
                // si il existe on update le doc
                userDocRef.set(user, { merge: true })
                  .then(() => {
                    console.log('User data updated in Firestore successfully!');
                  })
                  .catch((error) => {
                    console.error('Error updating user data in Firestore: ', error);
                  });
              } else {
                console.log('User does not exist in Firestore.');
              }
            });
          } else {
            console.log('User ID is undefined.');
          }
        } else {
          console.log('User data is undefined.');
        }
      });
    }
  }
}
