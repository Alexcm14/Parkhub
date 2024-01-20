import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PaypopupPage } from '../paypopup/paypopup.page';
import { SharedService } from '../shared.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {
  hasPaymentMethods = false;
  isAddPaymentMethodPopupOpen = false;

  constructor(private router: Router, public popoverController: PopoverController, private sharedService: SharedService) { }

  openAddPaymentMethodPopup(ev: any) {
    this.presentPopover(ev);
    this.router.navigate(['tabs/tab5']);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PaypopupPage,
      event: ev,
      translucent: true,
    });
    return await popover.present();
  }


  closeAddPaymentMethodPopup() {
    this.isAddPaymentMethodPopupOpen = false;
    
    
  }

  get cartesService() {
    return this.sharedService;
  }

  ngOnInit() {
  }

}
