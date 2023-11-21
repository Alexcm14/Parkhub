import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{
  loginForm: FormGroup

  constructor(public formbuilder:FormBuilder, public loadingCtrl: LoadingController, public authService:AuthService, public route : Router) {}

ngOnInit() {
  this.loginForm = this.formbuilder.group({
    email : ['', [
      Validators.required,
      Validators.email,
      Validators.pattern ("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"),
    ]],
    password: ['', 
    Validators.required,
    Validators.pattern ("(?=.*\d)(?=.*[a-z])(?=.*[0-8])(?=.*[A-Z])")
  
  
  ]
  
})
 }
 get errorControl(){
  return this.loginForm?.controls;
}

  async logIn(){
  const loading = await this.loadingCtrl.create();
  await loading.present();

  if(this.loginForm?.valid){
    const user = await this.authService.loginUser(this.loginForm.value.email,this.loginForm.value.password).catch((error) =>{
     console.log(error);
     loading.dismiss()
    })
 
    if(user){
     loading.dismiss()
     this.route.navigate(['../tab1'])
    }else{
     console.log('provide correct value')
    }
   }
  if(this.loginForm?.valid){
    // const user = await this.authService.registerUser(email, password)
  }
  }

}

 

