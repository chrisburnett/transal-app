import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from '../../../providers/location-service/location-service';
import { LoadingController } from 'ionic-angular';
import { Waypoint } from '../../waypoint';
import { Location } from '../../location';
import { Storage } from '@ionic/storage';

import * as moment from 'moment';

@IonicPage()
@Component({
	selector: 'location-notes-page',
	templateUrl: 'location-notes-page.html'
})
export class LocationNotesPage implements OnInit {

	// get notes from waypoint's locaton - allow them to be edited but in an append-only fashion
	// append form input to existing value and submit
	public waypoint: Waypoint;
	public location: Location;
	public last_revision_datestring: string;
	public locationForm: FormGroup;
	
	constructor(public formBuilder: FormBuilder, public locationService: LocationService, public translate: TranslateService, public navParams: NavParams, public loadingCtrl: LoadingController, public storage: Storage, public navCtrl: NavController)
	{
		this.locationForm = this.formBuilder.group({
			notes: ['']
		});
	}
	
	// location and waypoint will come in as nav params will come in as navigation parameters
	ngOnInit(): void {
		this.waypoint = this.navParams.get("waypoint");
		this.location = this.waypoint.location;
		this.locationForm.controls.notes.setValue(this.location.notes);
		this.last_revision_datestring = moment(this.location.last_revision_date).format("ddd, D MMM YYYY, H:mm:ss a");
	}

	submit(): void {
		const loading = this.loadingCtrl.create();

		this.location.notes = this.locationForm.value.notes
		
		loading.present();
		this.locationService.update(this.location).
			finally(() => {
				loading.dismiss();
				this.navCtrl.pop();
			}).subscribe();
	}
	
}
