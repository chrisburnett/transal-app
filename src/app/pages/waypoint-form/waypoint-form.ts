import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Waypoint } from '../../waypoint';
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
			})
		});
	}

	ngOnInit(): void {
		this.waypoint = new Waypoint();
	}

	submit(): void {
		let currentAssignment: Assignment = this.navParams.get("currentAssignment");
		this.waypoint = this.waypointForm.value;
		this.waypoint.route_id = currentAssignment.route.id;
		this.waypoint.scheduled = false;
		this.waypoint.reading_attributes.truck_id = currentAssignment.truck_id;
		this.waypoint.scheduled_date = new Date();
		this.waypoint.actual_date = this.waypoint.scheduled_date;

		//TODO: THIS IS WHERE CALL WILL START TO POST NEW WP, CHECK THIS WORKS
		this.waypointService.create(this.waypoint).subscribe(() => this.navCtrl.pop());
	}
	
}
