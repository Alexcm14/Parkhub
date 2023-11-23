import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-card-details-modal',
  template:`
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button (click)="dismissModal()">
          <ion-icon name="close"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    {{ content }}
  </ion-content>

`,

})
export class CardDetailsModalComponent {
  @Input() title: string;
  @Input() content: string;

  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }
}
