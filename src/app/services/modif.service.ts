// modif.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ModifService {

  constructor(private firestore: AngularFirestore) { }

  getLocationDetails(id: string) {
    return this.firestore.collection('emplacements').doc(id).valueChanges();
  }

  updateLocationDetails(id: string, data: any) {
    return this.firestore.collection('emplacements').doc(id).update(data);
  }
}
