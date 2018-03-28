import { Component } from '@angular/core';

import { ViewController, NavParams } from 'ionic-angular';

import { LocationService } from '../../../providers/location-service/location-service';

@Component({
	templateUrl: 'location-search-modal.html'
})
export class LocationSearchModal {

	constructor(public viewCtrl: ViewController, public locationService: LocationService, public params: NavParams)
	{
		
	}
	
	locationSelected(event): void {
		let location_attributes = this.params.get("location_attributes");
		// use parameter to update form object behind modal then nav back
		// don't emit an event when we update the form value, because we don't want
		// do trigger clearing the id/code which should happen when a user edits these values
		// (to prevent drivers updating canonical locations)
		location_attributes.get('id').setValue(event.id, {emitEvent: false});
		location_attributes.get('code').setValue(event.code, {emitEvent: false});
		location_attributes.get('name').setValue(event.name, {emitEvent: false});
		location_attributes.get('number').setValue(event.number, {emitEvent: false});
		location_attributes.get('street').setValue(event.street, {emitEvent: false});
		location_attributes.get('city').setValue(event.city, {emitEvent: false});
		location_attributes.get('postcode').setValue(event.postcode, {emitEvent: false});
		location_attributes.get('country_code').setValue(event.country_code, {emitEvent: false});
		this.viewCtrl.dismiss();
	}
}
