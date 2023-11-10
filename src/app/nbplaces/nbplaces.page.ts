import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-nbplaces',
  templateUrl: './nbplaces.page.html',
  styleUrls: ['./nbplaces.page.scss'],
})
export class NbplacesPage implements OnInit {

    NombrePlaces: number = 1;

  constructor(private navCtrl: NavController) { }

  incrementPlaces() {
    this.NombrePlaces++;
  }

  decrementPlaces() {
    if (this.NombrePlaces > 1) {
      this.NombrePlaces--;
    }
  }

  fermerPage() {
    this.navCtrl.navigateForward('tabs/tab4');
  }

  redirigerVersDescription() {
    this.navCtrl.navigateForward('/description');
  }

  ngOnInit() {
  }

}
