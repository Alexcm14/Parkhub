import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  valeur: number = 0;
  somme: number = 0;
  

  constructor() { }

  calculerSomme() {
    this.somme = this.valeur * 20;
  }

  ngOnInit() {
  }

}
