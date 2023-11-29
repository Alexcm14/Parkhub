// recapitulatif.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { VehicleSelectionService } from '../shared/vehicule-selection.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-recapitulatif',
  templateUrl: './recapitulatif.page.html',
  styleUrls: ['./recapitulatif.page.scss'],
})
export class RecapitulatifPage implements OnInit, OnDestroy {

  parkingType: string;
  parkingAddress: string;
  nbPlaces: number;
  selectedVehicleTypes$: Observable<string[]>;
  description: string;  // Ajoute la déclaration si nécessaire
  isAdPosted: boolean = false;

  constructor(private navCtrl: NavController, private route: ActivatedRoute, private vehicleSelectionService: VehicleSelectionService, private cdr: ChangeDetectorRef) {
    this.selectedVehicleTypes$ = this.vehicleSelectionService.selectedVehicleTypes$;
  }

  ngOnInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
  }
}
