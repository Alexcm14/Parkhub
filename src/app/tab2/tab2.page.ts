// tab2.page.ts

import { Component } from '@angular/core';
import { switchMap, take, from, map } from 'rxjs';
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
  myProfilePic: string;
  otherUserProfilePic: string;
  reservationData: any[];

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    
     this.authService.getLoggedInUserObservable().pipe(
      switchMap((userData) => {
        console.log('Raw userData:', userData);

        if (userData) {
          const userId = this.authService.uid || userData['uid']; // Access the UID property

          console.log('User ID:', userId);

          // Retrieve additional data from Firestore
          return this.firestore.collection('user_data').doc(userId).valueChanges();
        } else {
          console.log('User is not logged in');
          return from([]); // Empty observable
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
    
    // Fetch logged-in user data
    this.authService.getLoggedInUserObservable().pipe(
      take(1)
    ).subscribe((userData) => {
      console.log('Raw userData:', userData);

      if (userData) {
        this.email = userData.email;
        this.motDePasse = userData.motDePasse;
        console.log('User is logged in:', this.email, this.authService.uid);

        // Connecte le UID et EMAIL
        console.log('Logged-in UID:', this.authService.uid);
        console.log('Logged-in Email:', this.email);

        this.firestore.collection('user_data').doc(this.authService.uid).collection('reservation_data').snapshotChanges().pipe(
          take(1),
          map(actions => actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        ).subscribe((reservationData: any[]) => {
          console.log('Processed reservationData:', reservationData);
          this.reservationData = reservationData;
      
        
        });
      } else {
        this.email = '';
        this.motDePasse = '';
        console.log('User is not logged in');
      }
    });
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
      sender: this.authService.uid,
      senderName: this.prenom + ' ' + this.nom, // Ajout du nom de l'expéditeur
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
