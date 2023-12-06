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
  
      // Reference to the car_data subcollection
      const carDataRef = userDocRef.collection('car_data').doc(uid);
  
      // Set car data
      await carDataRef.set({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        plaque: '',
        marque: '',
      });
  
      // Reference to the emplacement_data subcollection
      const emplacementDataRef = userDocRef.collection('emplacement_data').doc(uid);
  
      // Set emplacement data
      await emplacementDataRef.set({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        emplacement_id: '',
        nb_places: '',
        statut: '',
        adresse: '',
        type_emplacement: '',
        type_vehicule: '',
        description: '',
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