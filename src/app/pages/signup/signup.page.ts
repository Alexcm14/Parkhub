import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AsyncValidatorFn } from '@angular/forms';

// Async Validator Function
export function isTenAsync(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const v: number = control.value;

    if (v !== 8) {
      // Emit an object with a validation error.
      return of({ 'notTen': true, 'requiredValue': 8 });
    }

    // Emit null, to indicate no error occurred.
    return of(null);
  };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  regForm: FormGroup;

  constructor(
    public formbuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.regForm = this.formbuilder.group({
      fullname: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
      Validators.pattern("/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/"),
         Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$"),
        ],
      ],
      // Add isTenAsync as an async validator
      someNumberControl: ['', [], [isTenAsync()]]
    });
  }

  get errorControl() {
    return this.regForm?.controls;
  }

  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    console.log('signup');

   // if (this.regForm?.valid) {
      console.log('valid');
      const user = await this.authService.registerUser(this.regForm.value.email, this.regForm.value.password).catch((error) => {
        console.log(error);
        loading.dismiss();
      });

      if (user) {
        loading.dismiss();
        this.router.navigate(['../tabs/tab1']);
      } else {
        console.log('provide correct value');
      }
  // } else {
    //  console.log('not valid');
   //   loading.dismiss();
  //  }
  }
}
