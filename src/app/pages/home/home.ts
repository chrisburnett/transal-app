import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
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
	currentWaypointArrivalDatestring: string;
	currentWaypointOverdue: boolean;
	previousWaypointDatestring: string;
	nextWaypointDatestring: string;

	currentWaypointIconName: string;
	nextWaypointIconName: string;
	previousWaypointIconName: string;
	currentWaypointLocationText: string;
	nextWaypointLocationText: string;
	previousWaypointLocationText: string;

	online: boolean;
	
	activityIconMap = {
		"pickup": "arrow-up",
		"deliver": "arrow-down",
		"service": "build",
		"fuel": "color-fill",
		"office": "home",
		"handover": "home",
		"trailer_change": "swap"
	}

	waypointFormPage: any;

	constructor(@Inject(APP_CONFIG) private config, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public navCtrl: NavController, public authService: AuthService, public assignmentService: AssignmentService, public waypointService: WaypointService, public translate: TranslateService, public network: Network) {}

	ngOnInit() {
		this.waypointFormPage = WaypointFormPage;
		this.authService.getCurrentUser().then((user) => {
			if(user) {
				this.currentUser = user;
			}
		});
		this.load();
	}

	ionViewDidEnter() {
		this.load();
	}

	load(): void {
		const loading = this.loadingCtrl.create();
		loading.present();

		moment.locale(this.config.lang);

		// track network status - don't send confirm when offline
		this.network.onConnect().subscribe(() => {
			this.online = true;
		});
		this.network.onDisconnect().subscribe(() => {
			this.online = false;
		});
		
		this.assignmentService.getCurrentAssignment()
			.subscribe(
				(assignment: Assignment) => {
					if(assignment)
					{
						this.currentAssignment = assignment;
						this.currentWaypoint = Route.getCurrentWaypoint(assignment.route);	
						this.previousWaypoint = Route.getPreviousWaypoint(assignment.route);
						this.nextWaypoint = Route.getNextWaypoint(assignment.route);
						
						if(this.currentWaypoint)
						{
							if(this.currentWaypoint.scheduled)
							{
								this.timeToCurrentWaypoint = Date.now().valueOf() > this.currentWaypoint.scheduled_date.valueOf() ?
									moment(this.currentWaypoint.scheduled_date).toNow() :
									moment(this.currentWaypoint.scheduled_date).fromNow();
								this.currentWaypointDatestring = moment(this.currentWaypoint.scheduled_date).format("ddd, D MMM YYYY, H:mm:ss a");
								this.currentWaypointOverdue = Date.now().valueOf() > this.currentWaypoint.scheduled_date.valueOf();
							}
							this.currentWaypointArrivalDatestring = moment(this.currentWaypoint.actual_date).format("ddd, D MMM YYYY, H:mm:ss a");
							this.currentWaypointIconName = this.activityIconMap[this.currentWaypoint.activity];
							
							this.translate.get('HOME.' + this.currentWaypoint.activity.toUpperCase()).subscribe((text: string) => {
								this.currentWaypointLocationText = text;
							});
						}
						
						if(this.previousWaypoint) {
							this.previousWaypointDatestring = moment(this.previousWaypoint.actual_departure_date).format("ddd, D MMM YYYY, H:mm:ss a");
							this.previousWaypointIconName = this.activityIconMap[this.previousWaypoint.activity];
							this.translate.get('HOME.' + this.previousWaypoint.activity.toUpperCase()).subscribe((text: string) => {
								this.previousWaypointLocationText = text;
							});
						}
						
						if(this.nextWaypoint) {
							this.nextWaypointDatestring = moment(this.nextWaypoint.scheduled_date).format("ddd, D MMM YYYY, H:mm:ss a");
							this.nextWaypointIconName = this.activityIconMap[this.nextWaypoint.activity];
							this.translate.get('HOME.' + this.nextWaypoint.activity.toUpperCase()).subscribe((text: string) => {
								this.nextWaypointLocationText = text;
							});
						}
					}
					loading.dismiss();
				},
				(error: any) => {
					// TODO: CHECK TYPE OF ERROR - HANDLE NO CONNECTION
					if(error.status == 401) {
						loading.dismiss();
						this.navCtrl.setRoot(LoginPage);	
					}
					// TODO: ELSE OFFLINE
				}
			)
	}

	logout(): void {
		this.authService.logout();
		this.navCtrl.setRoot(LoginPage);
	}

	checkIn(): void {
		this.navCtrl.push(WaypointFormPage, { waypoint: this.currentWaypoint, currentAssignment: this.currentAssignment });
	}

	checkOut(): void {
		this.currentWaypoint.actual_departure_date = new Date(Date.now());
		// TODO: DO SOMETHING IN SUBSCRIBE, REQUERY?
		this.waypointService.update(this.currentWaypoint).subscribe(() => { this.load() });
	}
	
	showConfirm(): void {
		let confirm = this.alertCtrl.create({
			title: this.translate.instant('HOME.CHECK_IN_TITLE'),
			message: this.translate.instant('HOME.CHECK_IN_MSG'),
			buttons: [
				{
				text: this.translate.instant('HOME.CHECK_IN_NO'),
				handler: () => {
					
				}
			},
				{
				text: this.translate.instant('HOME.CHECK_IN_YES'),
				handler: () => {
					this.checkIn();
				}
			}
			]
		});
		confirm.present();
	}

	currentCardTapped(event): void {
		this.currentWaypoint.read = true;
		this.waypointService.update(this.currentWaypoint).subscribe();
	}
}
