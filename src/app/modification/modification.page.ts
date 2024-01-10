import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

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
    private authService: AuthService
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

  updateEmplacement() {
    this.firestore.collection('user_data').doc(this.authService.uid)
      .collection('emplacement_data').doc(this.emplacementId)
      .update(this.emplacement)
      .then(() => {
        console.log('Emplacement updated successfully!');
        this.navCtrl.navigateBack('/annonces');
      })
      .catch(error => console.error('Error updating emplacement:', error));
  }
  
}

