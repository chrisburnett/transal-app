import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { APP_CONFIG } from '../../app/app.config';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AutoCompleteService } from 'ionic2-auto-complete';
import { Location } from '../../app/location';
import { LocationNote } from '../../app/location-note';
import { Storage } from '@ionic/storage';


import 'rxjs/add/operator/map';

@Injectable()
export class LocationNoteService {
	constructor(@Inject(APP_CONFIG) private config, public storage: Storage, public http: Http) {}

	url = `http://${this.config.apiEndpoint}/location_notes`;

	create(location_note: LocationNote): Observable<any> {
		let headers: Headers = new Headers();
		return Observable.fromPromise(this.storage.get("token"))
			.mergeMap(token => {
				headers.append('Authorization', 'Bearer ' + token);
				return this.http.post(this.url, { location_note: location_note }, { headers: headers })
					.map(response => {
						response.json() as LocationNote;
					});
			});
	}
	
}
