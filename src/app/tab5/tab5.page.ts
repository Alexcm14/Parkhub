import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  userName: string;
  credentials: FormGroup;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    // Fetch the user's information on component initialization
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // Assuming your user data in Firebase has a 'displayName' property
        this.userName = user.displayName || 'User'; // Default to 'User' if display name is not set

        // Initialize the form with the user's email and an empty password
        this.credentials = this.fb.group({
          email: [user.email || '', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
        });
      }
    });
  }

  goPersonal() {
    this.router.navigate(['/personal']);
  }

  goCar() {
    this.router.navigate(['/car']);
  }

  async logout() {
    await this.afAuth.signOut(); // Use AngularFireAuth method to sign out
    // You can navigate to the login page or any other desired page after logout
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
