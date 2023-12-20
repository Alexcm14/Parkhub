
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VehicleSelectionService } from '../shared/vehicule-selection.service';

@Component({
  selector: 'app-prix',
  templateUrl: './prix.page.html',
  styleUrls: ['./prix.page.scss'],
})
export class PrixPage implements OnInit {

  prix: number = 2.50;
  selectedDates: Date[] = [];

  isSelectionsAffichees: boolean = false;

  pinFormatter(value: number) {
    return `${value}€`;
  }

  constructor(private navCtrl: NavController, private vehicleSelectionService: VehicleSelectionService) { 
  }

  afficherSelections() {
    console.log('Début de afficherSelections()');
  
    if (this.prix && this.selectedDates.length > 0) {
      console.log('Toutes les valeurs sont définies');
      this.vehicleSelectionService.updateSelectedPrice(this.prix);
      this.vehicleSelectionService.updateSelectedDates(this.selectedDates);
      this.isSelectionsAffichees = true;
    } else {
      console.error('Valeurs invalides. Impossible de mettre à jour les sélections.');
    }
  
    console.log('Fin de afficherSelections()');
  }
  
  redirigerVersDesc() {
    this.navCtrl.navigateForward('/description');
  }

  fermerPage() {
    this.navCtrl.navigateForward('tabs/tab4');
  }

  ngOnInit() {
  }
}
