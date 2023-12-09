import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-paypopup',
  templateUrl: './paypopup.page.html',
  styleUrls: ['./paypopup.page.scss'],
})
export class PaypopupPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ajouterCarte() {
    this.navCtrl.navigateForward('/cartes');
  }

  ngOnInit() {
  }

}
