import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { APP_CONFIG } from '../../app/app.config';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AutoCompleteService } from 'ionic2-auto-complete';
import { Location } from '../../app/location';
import { Storage } from '@ionic/storage';


import 'rxjs/add/operator/map';

@Injectable()
export class LocationService implements AutoCompleteService {
	formValueAttribute = "";
	labelAttribute = "autocompleteValue";
	constructor(@Inject(APP_CONFIG) private config, public storage: Storage, public http: Http) {}

	url = `http://${this.config.apiEndpoint}/locations`;
	
	getResults(term: string) {
		return this.http.get(this.url + `?term=${term}`)
			.map(
				result => {
					return term.length > 2 ?
						result.json().map(location => {
							return location; })
						:
						[]
				}
			);
	}

	update(location: Location): Observable<any> {
		let headers: Headers = new Headers();
		return Observable.fromPromise(this.storage.get("token"))
			.mergeMap(token => {
				headers.append('Authorization', 'Bearer ' + token);
				return this.http.put(this.url + '/' + location.id, { location: location }, { headers: headers })
					.map(response => {
						response.json() as Location;
					});
			});
	}
	
}
