// modification-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModifService } from '../services/modif.service';

@Component({
  selector: 'app-modification-page',
  templateUrl: './modification-page.component.html',
  styleUrls: ['./modification-page.component.css']
})
export class ModificationPageComponent implements OnInit {
  locationId: string;
  locationDetails: any;

  constructor(
    private modifService: ModifService, 
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.locationId = this.route.snapshot.paramMap.get('id');
    this.modifService.getLocationDetails(this.locationId).subscribe(details => {
      this.locationDetails = details;
    });
  }

  updateLocation() {
    this.modifService.updateLocationDetails(this.locationId, this.locationDetails).then(() => {
      // Gérer la réussite de la mise à jour
      this.router.navigate(['/some-route']); // Rediriger après la mise à jour
    }).catch(error => {
      // Gérer les erreurs ici
      console.error("Erreur lors de la mise à jour : ", error);
    });
  }
}

