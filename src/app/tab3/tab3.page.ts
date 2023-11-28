import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CardDetailsModalComponent } from '../cards/card.component/card.component.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { from, of, switchMap, take } from 'rxjs';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {

  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;

  activeTab: string = 'reservations'; // Pour suivre l'onglet actif
  


  items = [
    { title: 'Item 1', description: 'Description for Item 1' },
    { title: 'Item 2', description: 'Description for Item 2' },
    { title: 'Item 3', description: 'Description for Item 3' },
    // ... Ajoutez d'autres éléments selon vos besoins
  ];



  itemsChunks: any[][]; // Pour stocker les éléments par groupe

  constructor(private modalController: ModalController, private authService: AuthService, private firestore: AngularFirestore) {}


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
  });
}
  

  //ngOnInit() {
    //this.itemsChunks = this.chunkArray(this.items, 3); // Divisez les éléments en groupes de 3
 // }

  // Fonction pour changer d'onglet
  switchTabs(tab: string) {
    this.activeTab = tab;
  }

  // Fonction pour afficher les détails de la carte
  async showDetails(item: any) {
    const modal = await this.modalController.create({
      component: CardDetailsModalComponent,
      componentProps: {
        item: item,
      },
    });
    return await modal.present();
  }

  // Fonction utilitaire pour diviser un tableau en groupes
  private chunkArray(array: any[], chunkSize: number): any[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
