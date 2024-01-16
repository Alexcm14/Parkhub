import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable, from, of, combineLatest } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Pipe, PipeTransform } from '@angular/core';
import { NgModule } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { interval, Subscription, } from 'rxjs';
import { Url } from 'url';
@Component({
  selector: 'app-res',
  templateUrl: './res.page.html',
  styleUrls: ['./res.page.scss'],
})
export class ResPage implements OnInit {
  emplacements: Observable<any[]>;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  reservations: any[] = [];
  reservationData: any[] = [];
  vehicles: any[] = [];
  Photos: Url;
  emplacementIds: string[] = [];
  departureTime: string;
  endTime: string;
  startTime:string;
  durationHours: string;


  constructor(
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    private modalController: ModalController,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    // Fetch logged-in user data
  this.authService.getLoggedInUserObservable().pipe(
    switchMap((userData) => {
      console.log('Raw userData:', userData);

      if (userData) {
        this.email = userData.email;
        this.motDePasse = userData.motDePasse;
        console.log('User is logged in:', this.email, this.authService.uid);

        // Connecte le UID et EMAIL
        console.log('Logged-in UID:', this.authService.uid);
        console.log('Logged-in Email:', this.email);

        // Retourne les données supplémentaires de Firestore
        return this.firestore.collection('user_data').doc(this.authService.uid).valueChanges();
      } else {
        this.email = '';
        this.motDePasse = '';
        console.log('User is not logged in');
        return from([]); // Chaîne qui continue
      }
    }),
    take(1)
  ).subscribe((additionalData: any) => {
    console.log('Processed additionalData:', additionalData);

    if (additionalData) {
      this.nom = additionalData.nom;
      this.prenom = additionalData.prenom;
      this.telephone = additionalData.telephone;
    } else {
      console.log('User data not found in Firestore.');
  }
  this.loadEmp();
  this.loadReservations();
  });
  
  }

  loadEmp() {
    this.firestore
      .collection('user_data')
      .doc(this.authService.uid)
      .collection('emplacement_data')
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          this.emplacementIds.push(id); // Store each emplacement ID
          return { id, ...data };
        }))
      )
      .subscribe((empData: any) => {
        if (empData) {
          console.log('emp Data with IDs:', empData);
          this.emplacements = empData;
          this.loadReservations();
        }
      });
  }
  loadReservations() {
    if (this.emplacementIds.length === 0) {
      console.log('No emplacements to query for reservations');
      return;
    }
  
    const reservationObservables = this.emplacementIds.map(emplacementId =>
      this.firestore.collectionGroup('reservation_data', ref =>
        ref.where('emplacementId', '==', emplacementId)
        .where('isPayed', '==', true)
      ).valueChanges()
    );
  
    combineLatest(reservationObservables).subscribe(allReservations => {
      // Flatten the array of arrays
      const mergedReservations = [].concat.apply([], allReservations);
      console.log('All matched reservations from all users:', mergedReservations);
      this.reservations = mergedReservations;
      console.log('Processed reservations:', this.reservations);

    });
  }
  
  




  processReservations(reservations: any[]) {
    return reservations.map(reservation => {
      const departureTime = new Date(reservation.departureTime);
      const endTime = new Date(reservation.endTime);
      const durationHours = (endTime.getHours() - departureTime.getHours()) / (1000 * 60 * 60);
  
      return {
        reservationId: reservation.reservationId,
        departureTime: departureTime.toLocaleString(),
        endTime: endTime.toLocaleString(),
        vehicleMarque: reservation.vehicleMarque,
        vehiclePlaque: reservation.vehiclePlaque,
        duration: reservation.duration,
        subtotal: reservation.subtotal, 
        total: reservation.total, 
      };
    });
  }
  
}