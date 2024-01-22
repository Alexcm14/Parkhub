import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/language.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.page.html',
  styleUrls: ['./conditions.page.scss'],
})
export class ConditionsPage implements OnInit {
  selectedLanguage: string = 'fr';
  termsAccepted: boolean = false;
constructor ( private firestore: AngularFirestore,
  private afAuth: AngularFireAuth,
    private languageService: LanguageService,  private translateService: TranslateService,private router: Router) {}



  ngOnInit() {this.languageService.selectedLanguage$.subscribe((language) => {
    this.selectedLanguage = language;
    this.translateService.use(language);
  });
}

async acceptTerms() {
  // Set the local variable to true
  this.termsAccepted = true;

  // Update the local storage
  localStorage.setItem('readenTerms', 'true');

  // Update the Firestore collection for the current user
  const user = await this.afAuth.currentUser;

  if (user) {
    const userId = user.uid;

    try {
      await this.firestore.collection('user_data').doc(userId).update({
        termsAccepted: true,
      });

      console.log('User data updated in Firestore.');
    } catch (error) {
      console.error('Error updating user data in Firestore:', error);
    }
  } else {
    console.error('User not authenticated.');
  }

  // Rediriger l'utilisateur vers la page souhaitée après l'acceptation
  this.router.navigate(['tabs/tab1']);
}
  
  changeLanguage() {
    this.languageService.setLanguage(this.selectedLanguage);
  }

}


