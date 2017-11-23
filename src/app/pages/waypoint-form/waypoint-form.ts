import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
import { Waypoint } from '../../waypoint';
import { Reading } from '../../reading';
import { WaypointService } from '../../../providers/waypoint-service/waypoint-service';
import { LocationSearchModal } from '../location-search-modal/location-search-modal';
import { Assignment } from '../../assignment';
import { AutoCompleteComponent } from 'ionic2-auto-complete';

import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
	selector: 'page-waypoint-form',
	templateUrl: 'waypoint-form.html',
})
export class WaypointFormPage implements OnInit {

	waypoint: Waypoint;
	waypointForm: FormGroup;
	currentAssignment: Assignment;
	
	@ViewChild('locationSearchbar')
	locationSearchbar: AutoCompleteComponent;

	title: string;
	
	constructor(private formBuilder: FormBuilder, public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, private waypointService: WaypointService, public translate: TranslateService, private geolocation: Geolocation) {
		this.waypointForm = this.formBuilder.group({
			activity: ['', Validators.required],
			location_attributes : this.formBuilder.group({
				id: [''],
				code: [''],
				name: ['', Validators.required],
				number: [''],
				street: ['', Validators.required],
				city: [''],
				postcode: ['', Validators.required],
				country_code: ['', Validators.required]
			}),
			reading_attributes: this.formBuilder.group({
				odometer: [''],
				maut: ['']
			}),
			additional_km: [''],
			price_per_litre: [''],
			litres_diesel: [''],
			additional_km_reason: [''],
			confirm_pickup_trailer_id: [''],
			confirm_leaving_trailer_id: ['']
		});

		// conditionally require values if fuelling selected
		this.waypointForm.controls.activity.valueChanges.subscribe(
			(activity: string) => {
				if(activity != "fuel") {
					this.waypointForm.controls.price_per_litre.setValidators(null);
					this.waypointForm.controls.litres_diesel.setValidators(null);
				}
				else {
					this.waypointForm.controls.price_per_litre.setValidators(Validators.required);
					this.waypointForm.controls.litres_diesel.setValidators(Validators.required);
				}
			}
		);

		// if location manually edited, clear id/code
		// fingers crossed this doesn't create an infinite loop
		this.waypointForm.controls.location_attributes.valueChanges.subscribe(
			data => {
				this.waypointForm.controls.location_attributes.get('code').setValue('', {emitEvent: false});
				this.waypointForm.controls.location_attributes.get('id').setValue('', {emitEvent: false});
			});

	}

	ngOnInit(): void {
		this.waypoint = this.navParams.get("waypoint");
		this.currentAssignment = this.navParams.get("currentAssignment");
		// if no waypoint passed then we are creating unscheduled
		// point - set up default values
		if(this.waypoint == null && this.currentAssignment)
		{
			this.waypoint = new Waypoint();
		 	this.waypoint.scheduled = false;
			this.waypoint.reading_attributes = new Reading();
			this.waypoint.scheduled_date = new Date();
			this.waypoint.actual_date = this.waypoint.scheduled_date;

			this.translate.get('NEW_WAYPOINT.NEW_WAYPOINT').subscribe((text: string) => this.title = text);
		}
		else
		{
			this.translate.get('CHECK_IN.CHECK_IN').subscribe((text: string) => this.title = text);
			this.waypointForm.controls.activity.setValue(this.waypoint.activity);

			// for existing waypoints we don't need this structure
			this.waypointForm.removeControl('location_attributes');
		}
	}

	submit(): void {
		// typescript merge dictionaries
		this.waypoint.actual_date = new Date(Date.now());
		let waypoint: Waypoint = { ...this.waypoint, ...this.waypointForm.value };
		waypoint.reading_attributes.truck_id = this.currentAssignment.truck_id;
		waypoint.route_id = this.currentAssignment.route.id;

		if(waypoint.location_attributes.id != '')
		{
			waypoint.location_id = waypoint.location_attributes.id;
		}

		let doSubmit = () => {
			if(waypoint.scheduled)
			{
				this.waypointService.update(waypoint).subscribe(() => this.navCtrl.pop());
			}
			else
			{
				this.waypointService.create(waypoint).subscribe(() => this.navCtrl.pop());
			}
		};
		
		this.geolocation.getCurrentPosition()
			.then((resp) => {
 				waypoint.gps_location_lat = String(resp.coords.latitude);
 				waypoint.gps_location_long = String(resp.coords.longitude);
				doSubmit();
			})
			.catch((error) => {
				console.log('Error getting location', error);
				doSubmit();
			});
	}

	showLocationSearchModal(): void {
		let lsm = this.modalCtrl.create(LocationSearchModal, {location_attributes: this.waypointForm.controls.location_attributes});
		lsm.present();
	}
	
}
