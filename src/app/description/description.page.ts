import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
})
export class DescriptionPage implements OnInit {

  customCounterFormatter(inputLength: number, maxLength: number) {
      return `${maxLength - inputLength} caractères restants`;
    }
  constructor(private navCtrl: NavController) { }

  fermerPage() {
    this.navCtrl.navigateForward('tabs/tab4');
  }

  ngOnInit() {
  }

}
