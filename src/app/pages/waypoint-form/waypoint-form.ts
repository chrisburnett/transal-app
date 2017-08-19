import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Waypoint } from '../../waypoint';

@IonicPage()
@Component({
	selector: 'page-waypoint-form',
	templateUrl: 'waypoint-form.html',
})
export class WaypointFormPage implements OnInit {

	waypoint: Waypoint;
	waypointForm: FormGroup;
	
	constructor(private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.waypointForm = this.formBuilder.group({
			name: ['', Validators.required],
			locationType: [''],
			address: [''],
			// need for
			// location_id (somehow need inline create/autoselect support)
			// activity
			// probably that's it for unscheduled WP
		});
	}

	ngOnInit(): void {
		this.waypoint = new Waypoint();
	}

}
