// config1.page.ts

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VehicleSelectionService } from '../shared/vehicule-selection.service'; 
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/language.service';

@Component({
  selector: 'app-config1',
  templateUrl: './config1.page.html',
  styleUrls: ['./config1.page.scss'],
})
export class Config1Page implements OnInit {
  selectedCard: string | null = null;
  selectedLanguage: string = 'fr';

  constructor(private languageService: LanguageService,  private translateService: TranslateService,private navCtrl: NavController, private vehicleSelectionService: VehicleSelectionService) {}

  selectCard(Type: string) {
    this.selectedCard = Type;
    this.vehicleSelectionService.updateSelectedParkingType(Type);
  }
  
  fermerPage() {
    this.navCtrl.navigateForward('tabs/annonces');
  }

  redirigerVerslocalisation() {
    this.navCtrl.navigateForward('/localisation');
  }

  ngOnInit() {
    this.languageService.selectedLanguage$.subscribe((language) => {
        this.selectedLanguage = language;
        this.translateService.use(language);
      });}

      changeLanguage() {
        this.languageService.setLanguage(this.selectedLanguage);
      }
}

