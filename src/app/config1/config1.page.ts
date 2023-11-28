import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-config1',
  templateUrl: './config1.page.html',
  styleUrls: ['./config1.page.scss'],
})

export class Config1Page implements OnInit {

  selectedCard: string | null = null;

  selectCard(Type: string) {
    this.selectedCard = this.selectedCard = Type;
  }
  
  constructor(private navCtrl: NavController) { }

 fermerPage() {
    this.navCtrl.navigateForward('tabs/tab4');
  }

  redirigerVerslocalisation() {
    this.navCtrl.navigateForward('/localisation');
  }

  ngOnInit() {
  }

}
