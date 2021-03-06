import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from 'ionic-angular';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
import { Waypoint } from '../../waypoint';
import { Reading } from '../../reading';
import { WaypointService } from '../../../providers/waypoint-service/waypoint-service';
import { AssignmentService } from '../../../providers/assignment-service/assignment-service';
import { LocationSearchModal } from '../location-search-modal/location-search-modal';
import { Assignment } from '../../assignment';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { LoadingController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

import 'rxjs/add/operator/finally';

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
	
	constructor(private formBuilder: FormBuilder, public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, private waypointService: WaypointService, private assignmentService: AssignmentService, public translate: TranslateService, private geolocation: Geolocation, private loadingCtrl: LoadingController, public alertCtrl: AlertController) {
		this.waypointForm = this.formBuilder.group({
			activity: ['', Validators.required],
			location_attributes : this.formBuilder.group({
				id: [''],
				code: [''],
				name: [''],
				number: [''],
				street: [''],
				city: [''],
				postcode: [''],
				country_code: ['']
			}),
			reading_attributes: this.formBuilder.group({
				odometer: ['', Validators.required],
				maut: ['']
			}),
			additional_km: [''],
			price_per_litre: [''],
			litres_diesel: [''],
			additional_km_reason: [''],
			new_trailer_registration: ['']
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

		// conditionally require reason if additional_km entered
		this.waypointForm.controls.additional_km.valueChanges.subscribe(
			(additional_km: string) => {
				if(additional_km != "") {
					this.waypointForm.controls.additional_km_reason.setValidators(Validators.required);
					this.waypointForm.controls.additional_km_reason.updateValueAndValidity();
				}
				else {
					this.waypointForm.controls.additional_km_reason.setValidators(null);
					this.waypointForm.controls.additional_km_reason.updateValueAndValidity();
				}
					
			}
		)

		// if location manually edited, clear id/code
		// fingers crossed this doesn't create an infinite loop
		this.waypointForm.controls.location_attributes.valueChanges.subscribe(
			data => {
				this.waypointForm.controls.location_attributes.get('code').setValue('', {emitEvent: false});
				this.waypointForm.controls.location_attributes.get('id').setValue('', {emitEvent: false});
			}
		);

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
			//this.waypoint.actual_date = this.waypoint.scheduled_date;

			this.translate.get('NEW_WAYPOINT.NEW_WAYPOINT').subscribe((text: string) => this.title = text);

			// set validation
			// if we are collecting location, validate on it
			// if no location ID, then it's new (unscheduled) OR we never knew
			// the location and we should prompt the driver
			let location = this.waypointForm.controls.location_attributes;

			location.get("name").setValidators(Validators.required)
			location.get("street").setValidators(Validators.required)
			location.get("postcode").setValidators(Validators.required)
			location.get("country_code").setValidators(Validators.required)

			// don't require km stand when creating unplanned WP
			// it will be provided later at checking
			let reading = this.waypointForm.controls.reading_attributes;
			reading.get("odometer").setValidators(null);
		}
		else
		{
			this.translate.get('CHECK_IN.CHECK_IN').subscribe((text: string) => this.title = text);
			this.waypointForm.controls.activity.setValue(this.waypoint.activity);
		}

		// special case - checking out sometimes requires gathering
		// pallet info, don't require KM/Additional again - disable validation
		if(this.waypoint.actual_departure_date && this.waypoint.activity != "handover")
		{
			this.waypointForm.controls.reading_attributes.get("odometer").setValidators(null)
		}

	}

	submit(): void {
		const loading = this.loadingCtrl.create();
		// typescript merge dictionaries
		let waypoint: Waypoint = { ...this.waypoint, ...this.waypointForm.value };
		waypoint.reading_attributes.truck_id = this.currentAssignment.driver_truck_assignment.truck.id;
		waypoint.reading_attributes.user_id = this.currentAssignment.driver_truck_assignment.user.id;

		// ensure trailer id references properly formatted as it is used as a key
		waypoint.new_trailer_registration = this.formatTrailerRegistration(waypoint.new_trailer_registration);
		waypoint.order_id = this.currentAssignment.order.id;

		if(waypoint.location_attributes && waypoint.location_attributes.id != '')
		{
			waypoint.location_id = waypoint.location_attributes.id;
		}

		let createOrUpdate = () => {
			if(waypoint.id)
			{
				// regardless of connection status, update locally saved assignment and nav back
				this.waypointService.update(waypoint)
					.finally(() => {
						this.waypoint = waypoint;
						loading.dismiss();
						this.assignmentService.updateStoredCurrentAssignment(this.currentAssignment).then(() => this.navCtrl.pop())
					}).subscribe();
			}
			else
			{
				this.waypointService.create(waypoint)
					.finally(() => {
						this.waypoint = waypoint;
						loading.dismiss();
						this.assignmentService.updateStoredCurrentAssignment(this.currentAssignment).then(() => this.navCtrl.pop())
					}).subscribe()
			}
		}
		
		let doSubmit = () => {
			loading.present();
			// TODO: RE-ENABLE ON PROD
			// this.geolocation.getCurrentPosition()
			// .then((resp) => {
 			// 	waypoint.gps_location_lat = String(resp.coords.latitude);
 			// 	waypoint.gps_location_long = String(resp.coords.longitude);
			// 	createOrUpdate();
			// })
			// .catch((error) => {
			// 	console.log('Error getting location', error);
			// 	createOrUpdate();
			// });
			createOrUpdate();
			
		};

		// check for alert conditions - if delta > 20km
		if(!waypoint.actual_departure_date) {
			if(waypoint.reading_attributes.odometer < this.waypoint.odometer_from_previous)
			{
				loading.dismiss();
				this.showIncorrectKMAlert();
				return;
			}
			else if(Math.abs(this.waypoint.distance_from_previous - (waypoint.reading_attributes.odometer - this.waypoint.odometer_from_previous)) > 20)
			{
				loading.dismiss();
				this.showKmConfirm().then(
					() => {
						doSubmit();
					},
					() => {});
				return;
			}
		}
		// CHECKING OUT
		// if pallet tracking required, exchange enforced and none
		// of the exchange values is non-zero
		else if(this.currentAssignment.pallet_types &&
				waypoint.actual_departure_date != null &&
				waypoint.activity != 'fuel' &&
				this.currentAssignment.order.enforce_pallet_exchange &&
				!waypoint.pallet_records_attributes.some((pr) => {
					return pr.picked_up != 0 || pr.dropped_off != 0;
				}))
		{
			loading.dismiss();
			this.showPalletExchangeRequiredAlert();
			return;
		}

		// if we get here then all is fine, submit
		loading.dismiss();
		doSubmit();
	}

	showKmConfirm(): Promise<any> {
		return new Promise<any> (
			(resolve, reject) => {
				let confirm = this.alertCtrl.create({
					title: this.translate.instant('NEW_WAYPOINT.KM_CONFIRM_TITLE'),
					message: this.translate.instant('NEW_WAYPOINT.KM_CONFIRM_WARNING'),
					buttons: [
						{
						text: this.translate.instant('NEW_WAYPOINT.KM_CONFIRM_CANCEL'),
						handler: () => {
							reject();
						}
					}, {
						text: this.translate.instant('NEW_WAYPOINT.KM_CONFIRM_OK'),
						handler: () => {
							resolve();
						}
					}
					]
		  		});
				confirm.present();
			});
	}

	showIncorrectKMAlert() {
		let alert = this.alertCtrl.create({
			title: this.translate.instant('NEW_WAYPOINT.KM_CONFIRM_TITLE'),
			message: this.translate.instant('NEW_WAYPOINT.KM_CONFIRM_TOO_FEW_KM'),
			buttons: ['OK']
		});
		alert.present();
	}

	showPalletExchangeRequiredAlert() {
		let alert = this.alertCtrl.create({
			title: this.translate.instant('NEW_PALLET_RECORD.ALERT_TITLE'),
			message: this.translate.instant('NEW_PALLET_RECORD.ALERT_NO_PALLETS_EXCHANGED'),
			buttons: ['OK']
		});
		alert.present();
	}

	

	showLocationSearchModal(): void {
		let lsm = this.modalCtrl.create(LocationSearchModal, {location_attributes: this.waypointForm.controls.location_attributes});
		lsm.present();
	}

	formatTrailerRegistration(trailerRegistration: string)
	{
		if(trailerRegistration != null)
		{
			return trailerRegistration.trim().toUpperCase();
		}
		else
		{
			return null;
		}
	}
	
}
