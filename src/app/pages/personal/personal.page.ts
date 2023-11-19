import { Component } from '@angular/core';

 
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
 
  constructor() {

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
