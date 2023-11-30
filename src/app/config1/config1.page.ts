// config1.page.ts

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VehicleSelectionService } from '../shared/vehicule-selection.service'; 

@Component({
  selector: 'app-config1',
  templateUrl: './config1.page.html',
  styleUrls: ['./config1.page.scss'],
})
export class Config1Page implements OnInit {
  selectedCard: string | null = null;

  constructor(private navCtrl: NavController, private vehicleSelectionService: VehicleSelectionService) {}

  selectCard(Type: string) {
    this.selectedCard = Type;
    this.vehicleSelectionService.updateSelectedParkingType(Type);
  }
  
  fermerPage() {
    this.navCtrl.navigateForward('tabs/tab4');
  }

  redirigerVerslocalisation() {
    this.navCtrl.navigateForward('/localisation');
  }

  ngOnInit() {}
}

