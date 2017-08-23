import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { User } from '../../user';
import { LoginPage } from '../login/login';
import { WaypointFormPage } from '../waypoint-form/waypoint-form';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../providers/auth-service/auth-service';
import { AssignmentService } from '../../../providers/assignment-service/assignment-service';
import { WaypointService } from '../../../providers/waypoint-service/waypoint-service';
import { Assignment } from '../../assignment';
import { Waypoint } from '../../waypoint';
import { Route } from '../../route';

import { APP_CONFIG } from '../../app.config';

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
	previousWaypointDatestring: string;
	nextWaypointDatestring: string;

	currentWaypointIconName: string;
	currentWaypointLocationText: string;
	
	activityIconMap = {
		"pickup": "arrow-up",
		"deliver": "arrow-down",
		"service": "build",
		"fuel": "color-fill",
		"office": "home",
		"handover": "home"
	}

	waypointFormPage: any;

	constructor(@Inject(APP_CONFIG) private config, public alertCtrl: AlertController, public navCtrl: NavController, public authService: AuthService, public assignmentService: AssignmentService, public waypointService: WaypointService, public translate: TranslateService) {}

	ngOnInit() {
		this.waypointFormPage = WaypointFormPage;
		this.authService.getCurrentUser().then((user) => {
			if(user) {
				this.currentUser = user;
			}
		});
		this.load();
	}

	load(): void {
		// set locale from config
		moment.locale(this.config.lang);
		
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
					this.currentWaypointIconName = this.activityIconMap[this.currentWaypoint.activity];

					this.translate.get('HOME.' + this.currentWaypoint.activity.toUpperCase()).subscribe((text: string) => {
						this.currentWaypointLocationText = text;
					});
				}

				if(this.previousWaypoint) {
					this.previousWaypointDatestring = moment(this.previousWaypoint.scheduled_date).format("ddd, D MMM YYYY, H:mm:ss a");
				}

				if(this.nextWaypoint) {
					this.nextWaypointDatestring = moment(this.nextWaypoint.scheduled_date).format("ddd, D MMM YYYY, H:mm:ss a");
				}
			}
		});
	}

	logout(): void {
		this.authService.logout();
		this.navCtrl.setRoot(LoginPage);
	}

	checkIn(): void {
		this.currentWaypoint.actual_date = new Date(Date.now());

		// lazy... reloading entire component. Necessary to do this?
		this.waypointService.update(this.currentWaypoint).subscribe(() => this.load());
	}
	
	showConfirm(): void {
		let confirm = this.alertCtrl.create({
			title: 'Check-in',
			message: 'Are you sure you want to check in to this waypoint?',
			buttons: [
				{
				text: 'No',
				handler: () => {
					
				}
			},
				{
				text: 'Yes',
				handler: () => {
					this.checkIn();
				}
			}
			]
		});
		confirm.present();
	}
}
