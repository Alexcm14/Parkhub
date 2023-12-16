import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { switchMap, from, take, map, finalize } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  userName: string;
  credentials: FormGroup;
  prenom: any;
  nom: any;
  userProfileImageUrl: string;
  hovering: boolean;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          this.userName = user.displayName || 'User';
          return this.firestore.collection('user_data').doc(user.uid).valueChanges();
        } else {
          return from([]);
        }
      }),
      take(1)
    ).subscribe((additionalData: any) => {
      if (additionalData) {
        this.prenom = additionalData.prenom;
        this.nom = additionalData.nom;
        this.userProfileImageUrl = additionalData.profileImageUrl;
      }
    });
  }

  goPersonal() {
    this.router.navigate(['/personal']);
  }

  goCar() {
    this.router.navigate(['/car']);
  }

  goPay() {
    this.router.navigate(['/pay']);
  }
  onHover(status: boolean): void {
    this.hovering = status;
  }

  changeImage(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const filePath = `profile_images/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, file);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.userProfileImageUrl = url;
            this.updateUserProfileImage(url);
          });
        })
      ).subscribe();
    }
  }

  private updateUserProfileImage(url: string) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.firestore.collection('user_data').doc(user.uid).update({
          profileImageUrl: url
        });
      }
    });
  }

  async logout() {
    await this.afAuth.signOut();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
