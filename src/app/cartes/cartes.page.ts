import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cartes',
  templateUrl: './cartes.page.html',
  styleUrls: ['./cartes.page.scss'],
})
export class CartesPage {
  numeroCarte: number;
  DateExp: Date;
  numeroCvc: number;

  // Injectez le service dans le constructeur
  constructor(private router: Router, private navCtrl: NavController, private sharedService: SharedService) {}

  ajouterCarte() {
    console.log('Informations de carte ajoutées :', this.numeroCarte);
    this.retourAuPopup();

    // Utilisez this.sharedService au lieu de SharedService
    this.sharedService.ajouterCarte({
      numeroCarte: this.numeroCarte,
      DateExp: this.DateExp,
      numeroCvc: this.numeroCvc,
    });
  }

  retourAuPopup() {
    this.navCtrl.navigateBack('/chemin-vers-votre-popup');
    this.router.navigate(['tabs/tab5']);
  }
}

