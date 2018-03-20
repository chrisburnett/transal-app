import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { User } from '../../user';
import { LoginPage } from '../login/login';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../providers/auth-service/auth-service';
import { AssignmentService } from '../../../providers/assignment-service/assignment-service';
import { WaypointService } from '../../../providers/waypoint-service/waypoint-service';
import { Assignment } from '../../assignment';
import { Waypoint } from '../../waypoint';
import { Order } from '../../order';

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
	
	previousWaypointDatestring: string;
	nextWaypointDatestring: string;

	nextWaypointIconName: string;
	previousWaypointIconName: string;
	
	nextWaypointLocationText: string;
	previousWaypointLocationText: string;
	
	online: boolean;


	constructor(@Inject(APP_CONFIG) private config, public loadingCtrl: LoadingController, public navCtrl: NavController, public authService: AuthService, public assignmentService: AssignmentService, public waypointService: WaypointService, public translate: TranslateService, public network: Network) {}
	
	ngOnInit() {
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

	public load(): void {
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
						this.currentWaypoint = Order.getCurrentWaypoint(this.currentAssignment.order);
						this.previousWaypoint = Order.getPreviousWaypoint(assignment.order);
						this.nextWaypoint = Order.getNextWaypoint(assignment.order);
						
						
						if(this.previousWaypoint) {
							this.previousWaypointDatestring = moment(this.previousWaypoint.actual_departure_date).format("ddd, D MMM YYYY, H:mm:ss a");
							this.previousWaypointIconName = this.config.activityIconMap[this.previousWaypoint.activity];
							this.translate.get('HOME.' + this.previousWaypoint.activity.toUpperCase()).subscribe((text: string) => {
								this.previousWaypointLocationText = text;
							});
						}
						
						if(this.nextWaypoint) {
							this.nextWaypointDatestring = moment(this.nextWaypoint.scheduled_date).format("ddd, D MMM YYYY, H:mm:ss a");
							this.nextWaypointIconName = this.config.activityIconMap[this.nextWaypoint.activity];
							this.translate.get('HOME.' + this.nextWaypoint.activity.toUpperCase()).subscribe((text: string) => {
								this.nextWaypointLocationText = text;
							});
						}
					}
					else
					{
						// server responded but no assignment returned
						this.currentAssignment = null;
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

}
