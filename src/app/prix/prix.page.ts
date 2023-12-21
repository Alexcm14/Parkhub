import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VehicleSelectionService } from '../shared/vehicule-selection.service';

@Component({
  selector: 'app-prix',
  templateUrl: './prix.page.html',
  styleUrls: ['./prix.page.scss'],
})
export class PrixPage implements OnInit {

  days = [
    { name: 'Lun', value: 'monday', selected: false },
    { name: 'Mar', value: 'tuesday', selected: false },
    { name: 'Mer', value: 'wednesday', selected: false },
    { name: 'Jeu', value: 'thursday', selected: false },
    { name: 'Ven', value: 'friday', selected: false },
    { name: 'Sam', value: 'saturday', selected: false },
    { name: 'Dim', value: 'sunday', selected: false }
  ];
  heureDebut: Date;
  heureFin: Date;

  prix: number = 2.50;

  isDateSaved: boolean = false;
  isSelectionsAffichees: boolean = false;

  pinFormatter(value: number) {
    return `${value}€`;
  }

  constructor(private navCtrl: NavController, private vehicleSelectionService: VehicleSelectionService) {
    this.heureDebut = new Date();
    this.heureFin = new Date();
  }

  afficherSelections() {
    console.log('Début de afficherSelections()');

    this.vehicleSelectionService.updateSelectedDays(this.days.filter(day => day.selected).map(day => day.value));

    if (this.prix) {
      console.log('Le prix est défini');
      this.vehicleSelectionService.updateSelectedPrice(this.prix);
      this.vehicleSelectionService.updateSelectedStartTime(this.formatTime(this.heureDebut));
    this.vehicleSelectionService.updateSelectedEndTime(this.formatTime(this.heureFin));

      const areDaysSelected = this.days.some(day => day.selected);
      if (areDaysSelected && this.heureDebut && this.heureFin) {
        console.log('Jours et heures sélectionnés');
      }

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

  private formatTime(date: Date): string {
    if (date instanceof Date) {
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      return `${hours}:${minutes}`;
    } else {
      console.error('La valeur fournie à formatTime n\'est pas une instance de Date.');
      return '';
    }
  }

  toggleDay(day: any) {
    day.selected = !day.selected;
  }

  ngOnInit() {
  }
}
