import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { APP_CONFIG } from '../../app/app.config';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import { Assignment } from '../../app/assignment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
//import 'rxjs/add/operator/throw';

const CURRENT_ASSIGNMENT_STORAGE_KEY = "currentAssignment";

/*
  Generated class for the AssignmentServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AssignmentService {
	
	constructor(@Inject(APP_CONFIG) private config, public http: Http, public storage: Storage) {}

	/*
	  Calls backend for current assignment. If backend cannot be
	  contacted, returns from cache. Otherwise, always fetch latest.
	 */
	getCurrentAssignment(): Observable<any> {
		const url = `http://${this.config.apiEndpoint}/assignment`;
		let headers: Headers = new Headers();
		
		return Observable.fromPromise(this.storage.get("token"))
			.mergeMap(token => {
				headers.append('Authorization', 'Bearer ' + token);
				return this.http.get(url, {headers: headers})
					.map(response => {
						let assignment: Assignment = response.json() as Assignment;
						this.storage.set("currentAssignment", assignment);
						console.log("[AssignmentService] Retrieved current assignment from backend");
						return assignment;
					})
					.catch(error => {
						if(error.status === 0) {
							console.log("[AssignmentService] No connection: retrieving current assignment from store");
							return Observable.fromPromise(this.storage.get("currentAssignment"));
						} else {
							throw(error);
						}
					});
			});
	}
	
}
