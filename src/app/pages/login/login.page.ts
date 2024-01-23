import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router, NavigationStart } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	credentials: FormGroup;

	constructor(
		private fb: FormBuilder,
		private loadingController: LoadingController,
		private alertController: AlertController,
		private authService: AuthService,
		private router: Router
	) {}

	
	get email() {
		return this.credentials.get('email');
	}

	get password() {
		return this.credentials.get('password');
	}

	ngOnInit() {
		this.credentials = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});
	}

	async register() {
		const loading = await this.loadingController.create();
		await loading.present();

		const user = await this.authService.register(this.credentials.value);
		await loading.dismiss();

		if (user) {
			this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
		} else {
			this.showAlert('Erreur', 'Veuillez réessayer en fournissant une adresse e-mail et un mot de passe.');
		}
	}

	async login() {
		const loading = await this.loadingController.create();
		await loading.present();

		const user = await this.authService.login(this.credentials.value);
		await loading.dismiss();

		if (user) {
			this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
		} else {
			this.showAlert('Échec de la connexion', 'Veuillez réessayer.');
		}
	}

	async showAlert(header, message) {
		const alert = await this.alertController.create({
			header,
			message,
			buttons: ['OK']
		});
		await alert.present();
	}

	async forgotPassword() {
		const alert = await this.alertController.create({
		  header: 'Mot de passe oublié',
		  message: 'Entrez votre adresse e-mail pour réinitialiser votre mot de passe.',
		  inputs: [
			{
			  name: 'email',
			  type: 'email',
			  placeholder: 'Votre adresse e-mail',
			},
		  ],
		  buttons: [
			{
			  text: 'Annuler',
			  role: 'cancel',
			  handler: () => {
				console.log('Annulation de la réinitialisation du mot de passe');
			  },
			},
			{
			  text: 'Réinitialiser',
			  handler: async (data) => {
				const loading = await this.loadingController.create();
				await loading.present();
	
				// Envoyez la demande de réinitialisation du mot de passe à votre service d'authentification
				this.authService
				  .resetPassword(data.email)
				  .then(() => {
					loading.dismiss();
					this.showAlert('Réinitialisation réussie', 'Veuillez consulter votre e-mail pour les instructions.');
				  })
				  .catch((error) => {
					loading.dismiss();
					this.showAlert('Erreur', 'Une erreur s\'est produite. Veuillez réessayer.');
				  });
			  },
			},
		  ],
		});
	
		await alert.present();
	  }
	
}
 

