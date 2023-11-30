import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PaypopupPage } from '../paypopup/paypopup.page';


@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {
  hasPaymentMethods = false;
  isAddPaymentMethodPopupOpen = false;

  constructor(public popoverController: PopoverController) { }

  openAddPaymentMethodPopup(ev: any) {
    this.presentPopover(ev);
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PaypopupPage, // Remplacez par le nom de votre PopoverPage
      event: ev,
      translucent: true,
    });
    return await popover.present();
  }


  closeAddPaymentMethodPopup() {
    this.isAddPaymentMethodPopupOpen = false;
  }

  ngOnInit() {
  }

}
