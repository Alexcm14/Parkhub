// nbplaces.page.ts
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VehicleSelectionService } from '../shared/vehicule-selection.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/language.service';

@Component({
  selector: 'app-nbplaces',
  templateUrl: './nbplaces.page.html',
  styleUrls: ['./nbplaces.page.scss'],
})
export class NbplacesPage implements OnInit {

  selectedVehicleTypes: string[] = [];
  selectedLanguage: string = 'fr';

  selectVehicleType(selectedTypes: string[]) {
    this.vehicleSelectionService.updateSelectedVehicleTypes(selectedTypes);
  }


  NombrePlaces: number = 1;

  constructor(private languageService: LanguageService,  private translateService: TranslateService,private navCtrl: NavController, private vehicleSelectionService: VehicleSelectionService) { }

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
    this.navCtrl.navigateForward('tabs/annonces');
  }

  redirigerVersPrix() {
    this.navCtrl.navigateForward('/prix');
  }

  ngOnInit() {
    this.languageService.selectedLanguage$.subscribe((language) => {
        this.selectedLanguage = language;
        this.translateService.use(language);
      });
  }

  changeLanguage() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}

