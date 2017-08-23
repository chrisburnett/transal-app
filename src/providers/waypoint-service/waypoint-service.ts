import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { APP_CONFIG } from '../../app/app.config';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import { Waypoint } from '../../app/waypoint';

import 'rxjs/add/operator/map';

/*
  Generated class for the WaypointServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class WaypointService {

	url = `http://${this.config.apiEndpoint}/waypoints`;
	
	constructor(@Inject(APP_CONFIG) private config, public http: Http, public storage: Storage) {}

	update(waypoint: Waypoint): Observable<any> {
		
		let headers: Headers = new Headers();
		
		return Observable.fromPromise(this.storage.get("token"))
			.mergeMap(token => {
				headers.append('Authorization', 'Bearer ' + token);
				return this.http.put(this.url + '/' + waypoint.id, { waypoint: waypoint }, {headers: headers})
					.map(response => response.json() as Waypoint);
			});
	}

	create(waypoint: Waypoint): Observable<any> {
		let headers: Headers = new Headers();
		return Observable.fromPromise(this.storage.get("token"))
			.mergeMap(token => {
				headers.append('Authorization', 'Bearer ' + token);
				return this.http.post(this.url + '/', { waypoint: waypoint }, {headers: headers})
					.map(response => response.json() as Waypoint);
			});
	}

}
