import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Waypoint } from '../../waypoint';
import { Reading } from '../../reading';
import { WaypointService } from '../../../providers/waypoint-service/waypoint-service';
import { Assignment } from '../../assignment';

@IonicPage()
@Component({
	selector: 'page-waypoint-form',
	templateUrl: 'waypoint-form.html',
})
export class WaypointFormPage implements OnInit {

	waypoint: Waypoint;
	waypointForm: FormGroup;
	
	constructor(private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, private waypointService: WaypointService) {
		this.waypointForm = this.formBuilder.group({
			activity: [''],
			location_attributes : this.formBuilder.group({
				name: ['', Validators.required],
				address: ['']
			}),
			reading_attributes: this.formBuilder.group({
				odometer: [''],
				maut: ['']
			}),
			additional_km: [''],
			price_per_litre: [''],
			litres_diesel: ['']
		});
	}

	ngOnInit(): void {
		this.waypoint = this.navParams.get("waypoint");

		// if no waypoint passed then we are creating unscheduled
		// point - set up default values
		if(this.waypoint == null)
		{
			let currentAssignment: Assignment = this.navParams.get("currentAssignment");
			this.waypoint = new Waypoint();
		 	this.waypoint.scheduled = false;
			this.waypoint.route_id = currentAssignment.route.id;
			this.waypoint.reading_attributes = new Reading();
			this.waypoint.reading_attributes.truck_id = currentAssignment.truck_id;
			this.waypoint.scheduled_date = new Date();
			this.waypoint.actual_date = this.waypoint.scheduled_date;
		}
	}

	submit(): void {
		this.waypoint = this.waypointForm.value;
		this.waypointService.create(this.waypoint).subscribe(() => this.navCtrl.pop());
	}
}
