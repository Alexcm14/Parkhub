import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modification',
  templateUrl: './modification.page.html',
  styleUrls: ['./modification.page.scss'],
})
export class ModificationPage implements OnInit {
  emplacementId: string;
  emplacement: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.emplacementId = paramMap.get('emplacementId');
      this.loadEmplacementData();
    });
  }

  loadEmplacementData() {
    if (this.emplacementId) {
      this.emplacement = this.firestore
        .collection('user_data')
        .doc(/* L'ID de l'utilisateur actuel */)
        .collection('emplacement_data')
        .doc(this.emplacementId)
        .valueChanges();
    }
  }

  retournerAnnonces() {
    this.navCtrl.navigateBack('/annonces');
  }
}

