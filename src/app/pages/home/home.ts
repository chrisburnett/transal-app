import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { JwtHelper } from 'angular2-jwt';
import { User } from '../../user';
import { LoginPage } from '../login/login';

import { AuthService } from '../../../providers/auth-service/auth-service';
import { AssignmentService } from '../../../providers/assignment-service/assignment-service';
import { Assignment } from '../../assignment';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage implements OnInit {

	currentUser: User;
	currentAssignment: Assignment;
	
	private jwtHelper: JwtHelper = new JwtHelper();

	constructor(public navCtrl: NavController, public authService: AuthService, public assignmentService: AssignmentService) {}

	ngOnInit() {
		this.authService.getCurrentUser().then((user) => {
			if(user) {
				this.currentUser = user;
			}
		});
		this.assignmentService.getCurrentAssignment().subscribe((assignment) => {
			console.log(assignment);
			this.currentAssignment = assignment;
		});
	}

	logout(): void {
		this.authService.logout();
		this.navCtrl.setRoot(LoginPage);
	}
}
