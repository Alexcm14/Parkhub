// tab2.page.ts

import { Component } from '@angular/core';
import { switchMap, take } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  messages: any[] = [];
  conversationId: string;
  newMessage: string = '';

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.subscribeToUserData();
    this.setupConversationAndMessages();
  }

  private subscribeToUserData() {
    this.authService.getLoggedInUserObservable().pipe(
      switchMap((userData) => {
        if (userData) {
          this.email = userData.email;
          this.motDePasse = userData.motDePasse;
          return this.firestore.collection('user_data').doc(this.authService.uid).valueChanges();
        } else {
          return [];
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
  }

  private setupConversationAndMessages() {
    const otherUserId = this.getOtherUserId();
    this.conversationId = this.firebaseService.createConversationId(this.authService.uid, otherUserId);
    this.subscribeToMessages();
  }

  private subscribeToMessages() {
    this.firebaseService.getConversationMessages(this.authService.uid, this.conversationId).subscribe((msgs) => {
      console.log(msgs); // Ajoutez cette ligne pour voir les données récupérées
      this.messages = msgs.map(a => a.payload.doc.data());
    });
  }
  
  


  sendMessage(messageContent: string): void {
    if (!messageContent.trim()) return;
    const messageData = {
      content: messageContent,
      timestamp: new Date().toISOString(), // Convertir Date en chaîne ISO
      sender: this.authService.uid
    };

    this.firebaseService.sendMessage(this.conversationId, messageData.sender, messageData.content, messageData.timestamp)
  .then(() => {
    this.newMessage = '';
    this.subscribeToMessages(); // Refresh the message list
  })
  .catch(err => console.error("Erreur d'envoi", err));

  }

  private getOtherUserId(): string {
    let otherUserId: string;
    this.activatedRoute.params.subscribe(params => {
      otherUserId = params['otherUserId'];
    });
    return otherUserId;
  }
}
