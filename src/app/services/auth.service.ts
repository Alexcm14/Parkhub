import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) {}

  getCurrentUserId(): Observable<string> {
    return this.auth.authState.pipe(
      take(1),
      switchMap((user) => {
        if (user) {
          return from([user.uid]);
        } else {
          return from([]);
        }
      })
    );
  }

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
      const { user } = userCredential;
      // Additional user data can be saved to Firestore here if needed
      return user;
    } catch (error) {
      console.error('Error registering user: ', error);
      return null;
    }
  }

  async login({ email, password }) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const { user } = userCredential;
      return user;
    } catch (error) {
      console.error('Error logging in: ', error);
      return null;
    }
  }

  logout() {
    return this.auth.signOut();
  }
}
