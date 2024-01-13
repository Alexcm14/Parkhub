import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-modification',
  templateUrl: './modification.page.html',
  styleUrls: ['./modification.page.scss'],
})
export class ModificationPage implements OnInit {
  emplacement: any = {};
  emplacementId: string;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.emplacementId = this.route.snapshot.paramMap.get('id');
    this.loadEmplacementData();
    
  }

  loadEmplacementData() {
    this.firestore.collection('user_data').doc(this.authService.uid)
      .collection('emplacement_data').doc(this.emplacementId)
      .valueChanges().subscribe(emplacementData => {
        this.emplacement = emplacementData;
      });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Données mises à jour',
      duration: 2500,
      color: 'primary'
    });
    toast.present();
  }

  updateEmplacement() {
    this.firestore.collection('user_data').doc(this.authService.uid)
      .collection('emplacement_data').doc(this.emplacementId)
      .update(this.emplacement)
      .then(() => {
        console.log('Emplacement updated successfully!');
        this.navCtrl.navigateBack('tabs/annonces');
        this.presentToast();
      })
      .catch(error => console.error('Error updating emplacement:', error));
  }
  
}

