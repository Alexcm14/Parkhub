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

  constructor(
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    private modalController: ModalController,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.authService.getLoggedInUserObservable().pipe(
      switchMap((userData) => {
        if (userData) {
          const userId = this.authService.uid || userData['uid'];
          return this.firestore.collection('user_data').doc(userId).valueChanges();
        } else {
          return from([]);
        }
      }),
      take(1)
    ).subscribe((additionalData: any) => {
      if (additionalData) {
        this.nom = additionalData.nom;
        this.prenom = additionalData.prenom;
        this.telephone = additionalData.telephone;
      }
    });

    this.authService.getLoggedInUserObservable().pipe(take(1)).subscribe((userData) => {
      if (userData) {
        this.email = userData.email;
        this.motDePasse = userData.motDePasse;
      }
    });
  }
}
