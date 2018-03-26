import { Component, OnInit, Pipe, PipeTransform, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LocationNoteService } from '../../../providers/location-note-service/location-note-service';
import { LoadingController } from 'ionic-angular';
import { Waypoint } from '../../waypoint';
import { Location } from '../../location';
import { LocationNote } from '../../location-note';
import { Storage } from '@ionic/storage';

import { APP_CONFIG } from '../../app.config';
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
	public location_notes: LocationNote[];
	public locationNoteForm: FormGroup;
	
	constructor(@Inject(APP_CONFIG) private config, public formBuilder: FormBuilder, public locationNoteService: LocationNoteService, public translate: TranslateService, public navParams: NavParams, public loadingCtrl: LoadingController, public storage: Storage, public navCtrl: NavController)
	{
		this.locationNoteForm = this.formBuilder.group({
			note: ['']
		});
	}
	
	// location and waypoint will come in as nav params will come in as navigation parameters
	ngOnInit(): void {
		this.waypoint = this.navParams.get("waypoint");
		this.location = this.waypoint.location;

		// TODO: NOTE: not ideal - at the moment, the server sends us all
		// notes, even ones that haven't been accepted. This is just
		// to simplify the controller, but really we shouldn't be
		// getting unaccepted notes
		this.location_notes = this.location.location_notes.filter(ln => ln.accepted == true);
	}

	submit(): void {
		const loading = this.loadingCtrl.create();
		let newLocationNote: LocationNote = { location_id: this.location.id, ...this.locationNoteForm.value };
		loading.present();
		this.locationNoteService.create(newLocationNote).
			finally(() => {
				loading.dismiss();
				this.navCtrl.pop();
			}).subscribe();
	}
	
}

@Pipe({
    name: 'momentPipe'
})
export class MomentPipe implements PipeTransform {

	constructor(@Inject(APP_CONFIG) private config) {}
	
    transform(value: Date|moment.Moment): any {
        moment().locale(this.config.lang);
		return moment().calendar().toLowerCase();
    }
}
