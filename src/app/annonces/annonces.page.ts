import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-annonces',
  templateUrl: './annonces.page.html',
  styleUrls: ['./annonces.page.scss'],
})
export class AnnoncesPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  redirigerVersConfig1() {
    this.navCtrl.navigateForward('/config1');
  }

  ngOnInit() {
  }

}
