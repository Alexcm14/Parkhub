import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import firebase from 'firebase/compat/app'; // Import firebase from the compat/app module
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) {}

  // Updated method to fetch the current user's data
  getLoggedInUserObservable(): Observable<any> {
    return this.auth.authState.pipe(
      switchMap((user) => {
        if (user) {
          // If the user is logged in, get user data from Firestore
          return this.firestore.collection('user_data').doc(user.uid).valueChanges();
        } else {
          // If the user is not logged in, return null or handle accordingly
          return from([]);
        }
      }),
      take(1)
    );
  }

  async register({ email, password }) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;
      const userDocRef = firebase.firestore().collection('user_data').doc(uid);
      await userDocRef.set({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        nom:'',
        prenom:'',
        email:userCredential.user.email,
        telephone:'',
      });
      // Additional user data can be saved to Firestore here if needed
      return userCredential.user;
    } catch (error) {
      console.error('Error registering user: ', error);
      return null;
    }
  }
  async login(credentials: { email: string; password: string }) {
    try {
      // Your login logic here
      // For example:
      const userCredential = await this.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
      return userCredential.user;
    } catch (error) {
      console.error('Error during login: ', error);
      return null;
    }
}
}