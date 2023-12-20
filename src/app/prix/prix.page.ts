import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VehicleSelectionService } from '../shared/vehicule-selection.service';
import { IonDatetime } from '@ionic/angular';

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

  toggleDay(dayValue: string) {
    const day = this.days.find(d => d.value === dayValue);
    if (day) {
      day.selected = !day.selected;
    }
  }

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
  
    // Vérifier si le prix est défini
    if (this.prix) {
      console.log('Le prix est défini');
      this.vehicleSelectionService.updateSelectedPrice(this.prix);
  
      // Vérifier si les jours sélectionnés, les heures de début et de fin sont définis
      const areDaysSelected = this.days.some(day => day.selected);
      if (areDaysSelected && this.heureDebut && this.heureFin) {
        console.log('Jours et heures sélectionnés');
        // Traitement pour les jours et les heures sélectionnés
        // Si votre service ne supporte pas cela directement, vous pourriez
        // devoir trouver un autre moyen de stocker ou utiliser ces informations.
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

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}T00:00:00Z`;
  }

  ngOnInit() {
  }
}
