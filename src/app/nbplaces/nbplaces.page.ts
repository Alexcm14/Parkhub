// nbplaces.page.ts
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VehicleSelectionService } from '../shared/vehicule-selection.service';


@Component({
  selector: 'app-nbplaces',
  templateUrl: './nbplaces.page.html',
  styleUrls: ['./nbplaces.page.scss'],
})
export class NbplacesPage implements OnInit {

  selectedVehicleTypes: string[] = [];

  selectVehicleType(selectedTypes: string[]) {
    this.vehicleSelectionService.updateSelectedVehicleTypes(selectedTypes);
  }


  NombrePlaces: number = 1;

  constructor(private navCtrl: NavController, private vehicleSelectionService: VehicleSelectionService) { }

  incrementPlaces() {
    this.NombrePlaces++;
    this.vehicleSelectionService.updateNumberOfPlaces(this.NombrePlaces);
  }

  decrementPlaces() {
    if (this.NombrePlaces > 1) {
      this.NombrePlaces--;
    }
    this.vehicleSelectionService.updateNumberOfPlaces(this.NombrePlaces);
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

