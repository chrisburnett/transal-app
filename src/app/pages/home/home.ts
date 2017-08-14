import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../user';
import { LoginPage } from '../login/login';

import { AuthService } from '../../../providers/auth-service/auth-service';
import { AssignmentService } from '../../../providers/assignment-service/assignment-service';
import { Assignment } from '../../assignment';
import { Waypoint } from '../../waypoint';
import { Route } from '../../route';

import * as moment from 'moment';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage implements OnInit {

	currentUser: User;
	currentAssignment: Assignment;
	currentWaypoint: Waypoint;
	previousWaypoint: Waypoint;
	nextWaypoint: Waypoint;
	
	timeToCurrentWaypoint: string;
	timeToNextWaypoint: string;

	currentWaypointDatestring: string;
	currentWaypointOverdue: boolean;
	
	constructor(public navCtrl: NavController, public authService: AuthService, public assignmentService: AssignmentService) {}

	ngOnInit() {
		this.authService.getCurrentUser().then((user) => {
			if(user) {
				this.currentUser = user;
			}
		});
		this.assignmentService.getCurrentAssignment().subscribe((assignment: Assignment) => {
			if(assignment)
			{
				this.currentAssignment = assignment;
				this.currentWaypoint = Route.getCurrentWaypoint(assignment.route);	
				this.previousWaypoint = Route.getPreviousWaypoint(assignment.route);
				this.nextWaypoint = Route.getNextWaypoint(assignment.route);

				if(this.currentWaypoint) {
					this.timeToCurrentWaypoint = Date.now().valueOf() > this.currentWaypoint.scheduled_date.valueOf() ?
						moment(this.currentWaypoint.scheduled_date).toNow() :
						moment(this.currentWaypoint.scheduled_date).fromNow();
					this.currentWaypointDatestring = moment(this.currentWaypoint.scheduled_date).format("ddd, D MMM YYYY, H:mm:ss a");
					this.currentWaypointOverdue = Date.now().valueOf() > this.currentWaypoint.scheduled_date.valueOf();
				}
			}
		});
	}

	logout(): void {
		this.authService.logout();
		this.navCtrl.setRoot(LoginPage);
	}
}
