import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CardDetailsModalComponent } from '../cards/card.component/card.component.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  activeTab: string = 'reservations'; // Pour suivre l'onglet actif

  items = [
    { title: 'Item 1', description: 'Description for Item 1' },
    { title: 'Item 2', description: 'Description for Item 2' },
    { title: 'Item 3', description: 'Description for Item 3' },
    // ... Ajoutez d'autres éléments selon vos besoins
  ];

  itemsChunks: any[][]; // Pour stocker les éléments par groupe

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.itemsChunks = this.chunkArray(this.items, 3); // Divisez les éléments en groupes de 3
  }

  // Fonction pour changer d'onglet
  switchTabs(tab: string) {
    this.activeTab = tab;
  }

  // Fonction pour afficher les détails de la carte
  async showDetails(item: any) {
    const modal = await this.modalController.create({
      component: CardDetailsModalComponent,
      componentProps: {
        item: item,
      },
    });
    return await modal.present();
  }

  // Fonction utilitaire pour diviser un tableau en groupes
  private chunkArray(array: any[], chunkSize: number): any[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
