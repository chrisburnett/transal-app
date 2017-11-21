import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { APP_CONFIG } from '../../app/app.config';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AutoCompleteService } from 'ionic2-auto-complete';
import { Location } from '../../app/location';

import 'rxjs/add/operator/map';

@Injectable()
export class LocationService implements AutoCompleteService {
	formValueAttribute = "";
	labelAttribute = "name";
	constructor(@Inject(APP_CONFIG) private config, public http: Http) {}

	getResults(term: string) {
		return this.http.get(`http://${this.config.apiEndpoint}/locations?term=${term}`)
			.map(
				result => { return term.length > 4 ? result.json() : [] }
			);
	}
	
}
