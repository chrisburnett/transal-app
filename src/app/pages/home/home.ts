import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController, ModalController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { User } from '../../user';
import { LoginPage } from '../login/login';
import { WaypointFormPage } from '../waypoint-form/waypoint-form';
import { OrderNotesModal } from '../order-notes-modal/order-notes-modal';
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
	
	online: boolean;

	waypointFormPage: any;

	constructor(@Inject(APP_CONFIG) private config, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public navCtrl: NavController, public authService: AuthService, public assignmentService: AssignmentService, public waypointService: WaypointService, public translate: TranslateService, public network: Network) {}
	
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

	showOrderNotesModal(): void {
		let onm = this.modalCtrl.create(OrderNotesModal, { order: this.currentAssignment.order } );
		onm.present();
	}

}
