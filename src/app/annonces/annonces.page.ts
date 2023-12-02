import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { from, take, switchMap, Observable, of } from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-annonces',
  templateUrl: './annonces.page.html',
  styleUrls: ['./annonces.page.scss'],
})
export class AnnoncesPage implements OnInit {
  emplacements: Observable<any[]>;
  Description: string;
  NumberOfPlaces: string;
  ParkingAdress: string;
  ParkingType: string;
  VehicleTypes: string;
  statut: boolean;
  nom: any;
  prenom: any;
  telephone: any;

  constructor(private navCtrl: NavController,private authService: AuthService, private firestore: AngularFirestore) {}

  redirigerVersConfig1() {
    this.navCtrl.navigateForward('/config1');
  }

  ngOnInit() {
    this.loadEmpData();
    this.authService
      .getLoggedInUserObservable()
      .pipe(
        switchMap((userData) => {
          console.log('Raw userData:', userData);

          if (userData) {
            const userId = this.authService.uid || userData['uid']; // Access the UID property

            console.log('User ID:', userId);

            // Retourne les données supplémentaires de Firestore
            return this.firestore
              .collection('user_data')
              .doc(userId)
              .valueChanges();
          } else {
            console.log('User is not logged in');
            return from([]); // Chaîne qui continue
          }
        }),
        take(1)
      )
      .subscribe((additionalData: any) => {
        console.log('Processed additionalData:', additionalData);

        if (additionalData) {
          this.nom = additionalData.nom;
          this.prenom = additionalData.prenom;
          this.telephone = additionalData.telephone;
        }
      });
    }
  
    loadEmpData() {
     
      this.firestore
        .collection('emplacement_data')
        .doc(this.authService.uid)
        .collection('emplacement_data')
        .valueChanges()
        .subscribe(
          (empData: any) => {
            if (empData) {
              console.log('Emp Data:', empData);
              
              this.emplacements = of(empData);
            } else {
              console.log('Nothing in empData');
              
              this.emplacements = of([]);
            }
          },
          (error) => {
            console.error('Error fetching data:', error);
            
            this.emplacements = of([]);
          }
        );
    }
  }
