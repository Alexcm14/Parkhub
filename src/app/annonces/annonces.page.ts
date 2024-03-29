import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { from, take, switchMap, Observable, of, BehaviorSubject } from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/language.service';




@Component({
  selector: 'app-annonces',
  templateUrl: './annonces.page.html',
  styleUrls: ['./annonces.page.scss'],
})
export class AnnoncesPage implements OnInit {
  aDesAnnonces: boolean = false;
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
  private emplacementsSubject = new BehaviorSubject<any[]>([]);

  selectedLanguage: string = 'fr';



  constructor(private languageService: LanguageService,  private translateService: TranslateService,private navCtrl: NavController,private authService: AuthService, private firestore: AngularFirestore, private router: Router) {}

  redirigerVersConfig1() {
    this.navCtrl.navigateForward('/config1');
  }
  goRes(){
    this.router.navigate(['/res'])
  }
  ngOnInit() {

    this.languageService.selectedLanguage$.subscribe((language) => {
      this.selectedLanguage = language;
      this.translateService.use(language);
    });
  
    

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

    changeLanguage() {
      this.languageService.setLanguage(this.selectedLanguage);
    }

    toggleAdPost(emplacement: any): void {
      console.log('Current status:', emplacement.isAdPosted);
      const updatedStatus = emplacement.isAdPosted;
    
      console.log('Updated status:', updatedStatus);
      this.firestore.collection('user_data').doc(this.authService.uid)
        .collection('emplacement_data').doc(emplacement.id)
        .update({ isAdPosted: updatedStatus })
        .then(() => {
          console.log('Update successful, new status:', updatedStatus);
          this.loadEmpData(); // Refresh data to update UI
        })
        .catch(error => console.error('Error updating document: ', error));
        
    }
    
    loadEmpData() {
      this.firestore
        .collection('user_data')
        .doc(this.authService.uid)
        .collection('emplacement_data')
        .snapshotChanges()
        .pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data }; // Combining the Firestore-generated ID with emplacement data
          }))
        )
        .subscribe(empData => {
          if (empData && empData.length > 0) {
            console.log('Emp Data:', empData);
            this.aDesAnnonces = true;
            this.emplacements = of(empData);
          } else {
            console.log('Nothing in empData');
            this.aDesAnnonces = false;
            this.emplacements = of([]);
          }
        },
        error => {
          console.error('Error fetching data:', error);
          this.aDesAnnonces = false;
          this.emplacements = of([]);
        });
    }
    
    editEmplacement(emplacementId: string) {
      this.navCtrl.navigateForward(`/modification/${emplacementId}`);
    }

    deleteEmplacement(emplacement: any): void {
      const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet emplacement ?');
    
      if (isConfirmed) {
        // Utilisez emplacement.id (et non emplacement.Id)
        const emplacementId = emplacement.id;
        console.log('Deleting emplacement with ID:', emplacementId); // Pour déboguer
    
        const userId = this.authService.uid;
    
        if (userId) {
          const emplacementPath = `user_data/${userId}/emplacement_data`;
          const emplacementRef = this.firestore.collection(emplacementPath).doc(emplacementId);
    
          emplacementRef.delete().then(() => {
            console.log('Emplacement deleted successfully from Firestore!');
            this.loadEmpData(); // Mise à jour des données
          }).catch((error) => {
            console.error('Error deleting emplacement from Firestore: ', error);
          });
        }
      }
    }
    
    
    
    deleteEmplacementFromFirestore(emplacementId: string): void {
      const userId = this.authService.uid;
    
      if (userId) {
        const emplacementPath = `user_data/${userId}/emplacement_data`;
    
        const emplacementRef = this.firestore.collection(emplacementPath).doc(emplacementId);
    
        emplacementRef.delete().then(() => {
          console.log('Emplacement deleted successfully from Firestore!');
        }).catch((error) => {
          console.error('Error deleting emplacement from Firestore: ', error);
        });
      }
    }
    
  }
