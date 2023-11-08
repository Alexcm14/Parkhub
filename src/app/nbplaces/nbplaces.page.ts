import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-nbplaces',
  templateUrl: './nbplaces.page.html',
  styleUrls: ['./nbplaces.page.scss'],
})
export class NbplacesPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  fermerPage() {
    this.navCtrl.navigateForward('tabs/tab4');
  }

  ngOnInit() {
  }

}
