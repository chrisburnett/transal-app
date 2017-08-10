import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { JwtHelper } from 'angular2-jwt';
import { User } from '../../user';
import { LoginPage } from '../login/login';

import { AuthService } from '../../services/auth-service';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage implements OnInit {

	currentUser: User;
	
	private jwtHelper: JwtHelper = new JwtHelper();

	constructor(public navCtrl: NavController, public authService: AuthService) {}

	ngOnInit() {
		this.authService.getCurrentUser().then((user) => {
			if(user) {
				this.currentUser = user;
			}
		});
	}

	logout(): void {
		this.authService.logout();
		this.navCtrl.setRoot(LoginPage);
	}
}
