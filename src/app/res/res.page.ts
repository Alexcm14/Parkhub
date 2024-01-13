import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable, from, of } from 'rxjs';
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
  this.fetchReservations();
  });
  }

  fetchReservations() {
    this.firestore.collection('reservations', ref => ref.where('userId', '==', this.authService.uid))
      .valueChanges({ idField: 'reservationId' })
      .pipe(
        map(reservations => this.processReservations(reservations))
      )
      .subscribe(processedReservations => {
        console.log('Réservations récupérées:', processedReservations); // Ajoutez cette ligne
        this.reservations = processedReservations;
        this.cdr.detectChanges();
      });
  }
  

  processReservations(reservations: any[]) {
    return reservations.map(reservation => {
      const startTime = new Date(reservation.departureTime);
      const endTime = new Date(reservation.endTime);
      const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      const subtotal = reservation.price * durationHours;
      const total = subtotal * 0.8;
  
      return {
        reservationId: reservation.reservationId,
        startTime: startTime.toLocaleString(),
        endTime: endTime.toLocaleString(),
        vehicleMarque: reservation.vehicleMarque, // Assurez-vous que ces champs existent
        vehiclePlaque: reservation.vehiclePlaque, // dans l'objet de réservation
        durationHours,
        subtotal,
        total: reservation.total,
      };
    });
  }
  
  
  
}