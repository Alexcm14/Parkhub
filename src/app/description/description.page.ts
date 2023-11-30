// description.page.ts
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VehicleSelectionService } from '../shared/vehicule-selection.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
})
export class DescriptionPage implements OnInit {

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} caractères restants`;
  }

  description: string = '';
  isDescriptionSaved: boolean = false;
  photos: string[] = [];

  constructor(private navCtrl: NavController, private vehicleSelectionService: VehicleSelectionService, private cdr: ChangeDetectorRef) { }

  fermerPage() {
    this.navCtrl.navigateForward('tabs/tab4');
  }
  
  handleFileInput(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      console.log('Selected files:', files);
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.photos.push(e.target?.result as string);
          this.cdr.detectChanges(); // Forcez la mise à jour du modèle
          this.enregistrerPhotos(); // Assurez-vous que la fonction est appelée après l'ajout de la photo
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }
  
  redirigerVersRecap() {
    this.navCtrl.navigateForward('/recapitulatif');
  }

  enregistrerDescription() {
    this.vehicleSelectionService.setSelectedDescription(this.description);
    this.isDescriptionSaved = true;
  }

  modifierDescription() {
    this.isDescriptionSaved = false;
  }

  ajouterPhoto() {
    this.photos.push('https://via.placeholder.com/150');
    this.enregistrerPhotos();
  }
  

  enregistrerPhotos() {
    this.vehicleSelectionService.setSelectedPhotos(this.photos);
    this.vehicleSelectionService.updateSelectedPhotos(this.photos);
  }
  

  ngOnInit() {
  }
}
