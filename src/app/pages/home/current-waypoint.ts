import { Component, OnInit, Input, Output, Inject, EventEmitter } from '@angular/core';
import { Order } from '../../order'; 
import { Assignment } from '../../assignment';
import { Waypoint } from '../../waypoint';
import { APP_CONFIG } from '../../app.config';
import { TranslateService } from '@ngx-translate/core';

import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { WaypointFormPage } from '../waypoint-form/waypoint-form';
import { LocationNotesPage } from '../location-notes-page/location-notes-page';
import { AssignmentService } from '../../../providers/assignment-service/assignment-service';
import { WaypointService } from '../../../providers/waypoint-service/waypoint-service';

import * as moment from 'moment';

@Component({
	selector: 'current-waypoint',
	templateUrl: 'current-waypoint.component.html'
})
export class CurrentWaypoint implements OnInit {

	@Input() currentAssignment: Assignment;
	@Input() currentWaypoint: Waypoint;

	@Output() waypointUpdated = new EventEmitter();
	
	public distanceToCurrentWaypoint: number;
	public timeToCurrentWaypoint: string;
	public currentWaypointDatestring: string;
	public currentWaypointArrivalDatestring: string;
	public currentWaypointOverdue: boolean;

	public currentWaypointIconName: string;
	public currentWaypointLocationText: string;

	public locationNotesPage: any;
	
	constructor(@Inject(APP_CONFIG) private config, public alertCtrl: AlertController, public translate: TranslateService, public navCtrl: NavController, public assignmentService: AssignmentService, public waypointService: WaypointService) {
		this.locationNotesPage = LocationNotesPage;
	}
	
	ngOnInit() {
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
			this.currentWaypointIconName = this.config.activityIconMap[this.currentWaypoint.activity];
			
			this.translate.get('HOME.' + this.currentWaypoint.activity.toUpperCase()).subscribe((text: string) => {
				this.currentWaypointLocationText = text;
			});
		}
	}

	checkIn(): void {
		this.currentWaypoint.actual_date = new Date(Date.now());
		this.currentWaypointArrivalDatestring = moment(this.currentWaypoint.actual_date).format("ddd, D MMM YYYY, H:mm:ss a");
		this.navCtrl.push(WaypointFormPage, { waypoint: this.currentWaypoint, currentAssignment: this.currentAssignment });
	}

	checkOut(): void {
		this.currentWaypoint.actual_departure_date = new Date(Date.now());
		this.assignmentService.updateStoredCurrentAssignment(this.currentAssignment);

		// for driver changeover, collect a reading on checkout
		// alternatively if collecting pallet information, we need to get this now too
		if(this.currentWaypoint.activity == "handover" ||
		   (this.currentWaypoint.activity != "fuel" && this.currentAssignment.pallet_types))
		{
			this.navCtrl.push(WaypointFormPage, { waypoint: this.currentWaypoint, currentAssignment: this.currentAssignment });	
		}
		else
		{
			// reload from storage regardless of connection
			this.waypointService.update(this.currentWaypoint).subscribe(
				() => {
					this.waypointUpdated.emit(); // on success
				},
				() => {
					this.waypointUpdated.emit(); // on failure
				});
		}
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
