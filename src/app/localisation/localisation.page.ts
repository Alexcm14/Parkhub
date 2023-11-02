import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-localisation',
  templateUrl: './localisation.page.html',
  styleUrls: ['./localisation.page.scss'],
})
export class LocalisationPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  fermerPage() {
    this.navCtrl.navigateForward('tabs/tab4');
  }


  ngOnInit() {
  }

}
