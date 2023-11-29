import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-config1',
  templateUrl: './config1.page.html',
  styleUrls: ['./config1.page.scss'],
})
export class Config1Page implements OnInit {
  selectedCard: string | null = null;

  constructor(private navCtrl: NavController, public sharedService: SharedService) {}

  selectCard(Type: string) {
    this.selectedCard = Type;
  }
  
  fermerPage() {
    this.navCtrl.navigateForward('tabs/tab4');
  }

  redirigerVerslocalisation() {
    this.navCtrl.navigateForward('/localisation');
  }

  ngOnInit() {}
}

