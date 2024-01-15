// firebase.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) {}

  createConversation(userId: string, participants: string[]): Promise<void> {
    const conversationId = this.firestore.createId();
    return this.firestore.collection('user_data').doc(userId).collection('conversation_data').doc(conversationId).set({
      participantIds: participants
    });
  }

  getUserConversations(userId: string) {
    return this.firestore.collection('user_data').doc(userId).collection('conversation_data', ref => ref.where('participantIds', 'array-contains', userId)).snapshotChanges();
  }

  getConversationMessages(userId: string, conversationId: string) {
    return this.firestore.collection(`user_data/${userId}/conversation_data/${conversationId}/messages`, ref => ref.orderBy('timestamp')).snapshotChanges();
  }
  
  getMessages(userId: string, conversationId: string) {
    return this.firestore.collection('user_data').doc(userId).collection('conversation_data').doc(conversationId).collection('messages', ref => ref.orderBy('timestamp')).valueChanges();
  }

  createConversationId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('_');
  }

  sendMessage(conversationId: string, senderId: string, messageText: string, timestamp: string): Promise<void> {
    return new Promise((resolve, reject) => {
        this.firestore.collection(`user_data/${senderId}/conversation_data/${conversationId}/messages`).add({
            senderId,
            text: messageText,
            timestamp
        }).then(() => resolve()).catch(error => reject(error));
    });
}


}
