import { Component } from '@angular/core';

import { HomePage } from '../home/home';

import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { AuthService } from '../../services/auth-service';


@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage {

	model: any = {};
	
	constructor(public navCtrl: NavController, public toastCtrl: ToastController, private authService: AuthService) {
		
	}

	authenticate(): void {
		this.authService.authenticate(this.model.username, this.model.password)
			.subscribe(
				auth_token => this.navCtrl.setRoot(HomePage),
				error => {
					let toast = this.toastCtrl.create({
						message: 'Invalid username or password',
						duration: 3000
					});
					toast.present();
				}
			);
	}
	
}
