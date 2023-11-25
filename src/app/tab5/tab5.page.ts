import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { switchMap, from, take,map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  userName: string;
  credentials: FormGroup;
  prenom: any;
  nom: any;
  authService: any;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private firestore: AngularFirestore
    
  ) {}

  ngOnInit() {
    // Check if the user is already authenticated
    this.afAuth.authState.pipe(
      switchMap((user) => {
        console.log('Raw userData:', user);

        if (user) {
          this.userName = user.displayName || 'User';

          // Display the logged-in email and UID in the console
          console.log('Logged-in Email:', user.email);
          console.log('Logged-in UID:', user.uid);

          // Return additional user data from Firestore
          return this.firestore.collection('user_data').doc(user.uid).valueChanges();
        } else {
          console.log('User is not logged in');
          return from([]); // Continue the observable chain
        }
      }),
      take(1)
    ).subscribe((additionalData: any) => {
      console.log('Processed additionalData:', additionalData);

      if (additionalData) {
        // Assuming 'prenom' and 'nom' are fields in your Firestore document
        this.prenom = additionalData.prenom;
        this.nom = additionalData.nom;
      } else {
        console.log('User data not found in Firestore.');
      }
    });
  }

  goPersonal() {
    this.router.navigate(['/personal']);
  }

  goCar() {
    this.router.navigate(['/car']);
  }

  async logout() {
    await this.afAuth.signOut(); // Use AngularFireAuth method to sign out
    // You can navigate to the login page or any other desired page after logout
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}