import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router, NavigationStart } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{
  loginForm: FormGroup

  constructor(public formbuilder:FormBuilder, public loadingCtrl: LoadingController, public authService:AuthService, public route : Router, private navCtrl: NavController, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('Navigation started');
        console.log('Target URL:', event.url);
      }
    });
  }

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

 

