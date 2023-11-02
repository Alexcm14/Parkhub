import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-config1',
  templateUrl: './config1.page.html',
  styleUrls: ['./config1.page.scss'],
})
export class Config1Page implements OnInit {

  constructor(private navCtrl: NavController) { }

 fermerPage() {
    this.navCtrl.navigateForward('tabs/tab4');
  }

  ngOnInit() {
  }

}
