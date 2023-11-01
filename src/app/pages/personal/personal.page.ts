import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { IonicStorageModule } from '@ionic/storage-angular';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.page.html',
  styleUrls: ['./personal.page.scss'],
})

export class PersonalPage {
  nom: string = "";
  prenom: string = "";
  email: string = "";
  motDePasse: string = "";
  telephone: string = "";
  registreNational: string = "";

  constructor(private storage: Storage) {
    // Initialize the storage
    this.initStorage();
  }

  // Initialize Ionic Storage
  async initStorage() {
    await this.storage.create();
  }

  enregistrer() {
    // Create an object with user data
    const userData = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      motDePasse: this.motDePasse,
      telephone: this.telephone,
      registreNational: this.registreNational,
    };

    // Save user data to local storage
    this.storage.set('userData', userData).then(() => {
      console.log('Données enregistrées localement :', userData);
      this.resetFields();
    });
  }

  resetFields() {
    // Reset input fields after saving data
    this.nom = '';
    this.prenom = '';
    this.email = '';
    this.motDePasse = '';
    this.telephone = '';
    this.registreNational = '';
  }
}
