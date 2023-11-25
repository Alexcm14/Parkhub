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

  // Inside ngOnInit()
  ngOnInit() {
    // Fetch logged-in user data
    this.authService.getLoggedInUserObservable().pipe(
      switchMap((userData) => {
        console.log('Raw userData:', userData); // Log the raw user data

        if (userData) {
          this.email = userData.email;
          this.motDePasse = userData.motDePasse;
          console.log('User is logged in:', this.email, this.authService.uid);

          // Log the UID and email
          console.log('Logged-in UID:', this.authService.uid);
          console.log('Logged-in Email:', this.email);

          // Return an observable with additional user data
          return of({
            userData: userData,
            additionalData: this.firestore.collection('user_data').doc(this.authService.uid).valueChanges(),
          });
        } else {
          this.email = '';
          this.motDePasse = '';
          console.log('User is not logged in');
          return from([]); // Return an observable to keep the pipe chain going
        }
      }),
      take(1)
    ).subscribe(({ userData, additionalData }: { userData: any; additionalData: any }) => {
      console.log('Processed userData:', userData); // Log the processed user data

      if (additionalData) {
        this.nom = additionalData.nom;
        this.prenom = additionalData.prenom;
        this.telephone = additionalData.telephone;

        // Log additional user data next to this.email and UID
        console.log('Additional user data:', {
          email: this.email,
          uid: this.authService.uid,
          nom: this.nom,
          prenom: this.prenom,
          telephone: this.telephone,
        });
      } else {
        console.log('User data not found in Firestore.');
      }
    });
  }

  // Inside enregistrer()
  enregistrer() {
    if (this.nom && this.prenom && this.email && this.telephone) {
      // Get the user observable
      const userObservable = this.authService.getLoggedInUserObservable();

      // Subscribe to the user observable to get the user data
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

            // Check if the user exists in Firestore
            userDocRef.get().subscribe((doc: any) => {
              if (doc.exists) {
                // User exists, update the document
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
