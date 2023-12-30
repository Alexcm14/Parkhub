import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
 
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getCurrentUser() {
    throw new Error('Method not implemented.');
  }
  uid: string;
 
  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) {}
 
  // fetch les données
  getLoggedInUserObservable(): Observable<any> {
    return this.auth.authState.pipe(
      switchMap((user) => {
        if (user) {
          // Store the UID in the AuthService
          this.uid = user.uid;
 
          // User connecté/ fetch ses données
          return this.firestore.collection('user_data').doc(this.uid).valueChanges();
        } else {
          // pas connecté/rien
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
  
      // Reference to the main user_data document
      const userDocRef = this.firestore.collection('user_data').doc(uid);
  
      // Set user-related data
      await userDocRef.set({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        nom: '',
        prenom: '',
        email: userCredential.user.email,
        telephone: '',
      });
  
      

      return userCredential.user;
    } catch (error) {
      console.error('Error registering user: ', error);
      return null;
    }
  }
  
 
  async login(credentials: { email: string; password: string }) {
    try {
      // Your login logic here
      const userCredential = await this.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
      this.uid = userCredential.user.uid; // Store the UID in the AuthService
      return userCredential.user;
    } catch (error) {
      console.error('Error during login: ', error);
      return null;
    }
  }
}