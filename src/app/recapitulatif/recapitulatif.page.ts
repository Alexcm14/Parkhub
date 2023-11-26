import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recapitulatif',
  templateUrl: './recapitulatif.page.html',
  styleUrls: ['./recapitulatif.page.scss'],
})
export class RecapitulatifPage implements OnInit {

  parkingType: string;
  parkingAddress: string;
  availableSpaces: number;
  acceptedVehicles: string;
  description: string;
  isAdPosted: boolean = false;
  
  constructor() { }

  ngOnInit() {
  }

}
