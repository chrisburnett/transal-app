import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../user';
import { LoginPage } from '../login/login';

import { AuthService } from '../../../providers/auth-service/auth-service';
import { AssignmentService } from '../../../providers/assignment-service/assignment-service';
import { Assignment } from '../../assignment';
import { Waypoint } from '../../waypoint';
import { Route } from '../../route';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage implements OnInit {

	currentUser: User;
	currentAssignment: Assignment;
	currentWaypoint: Waypoint;
	
	constructor(public navCtrl: NavController, public authService: AuthService, public assignmentService: AssignmentService) {}

	ngOnInit() {
		this.authService.getCurrentUser().then((user) => {
			if(user) {
				this.currentUser = user;
			}
		});
		this.assignmentService.getCurrentAssignment().subscribe((assignment: Assignment) => {
			console.log(assignment);
			this.currentAssignment = assignment;
			this.currentWaypoint = Route.getCurrentWaypoint(assignment.route);
		});
	}

	logout(): void {
		this.authService.logout();
		this.navCtrl.setRoot(LoginPage);
	}
}
