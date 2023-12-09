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
  dateDebut: Date;
  dateFin: Date;   
  minDate: string;

  isDateSaved: boolean = false;
  isSelectionsAffichees: boolean = false;

  pinFormatter(value: number) {
    return `${value}€`;
  }

  constructor(private navCtrl: NavController, private vehicleSelectionService: VehicleSelectionService) { 
    this.minDate = this.formatDate(new Date());
    this.dateDebut = new Date();  // Initialise dateDebut avec la date actuelle
  }

  afficherSelections() {
    console.log('Début de afficherSelections()');
  
    if (this.prix && this.dateDebut && this.dateFin) {
      console.log('Toutes les valeurs sont définies');
      this.vehicleSelectionService.updateSelectedPrice(this.prix);
      this.vehicleSelectionService.updateSelectedStartDate(this.dateDebut);
      this.vehicleSelectionService.updateSelectedEndDate(this.dateFin);
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

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}T00:00:00Z`;
  }

  ngOnInit() {
  }
}
