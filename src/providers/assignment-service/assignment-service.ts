import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { APP_CONFIG } from '../../app/app.config';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import { Assignment } from '../../app/assignment';

import { WaypointService } from '../waypoint-service/waypoint-service';

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
	
	constructor(@Inject(APP_CONFIG) private config, public http: Http, public storage: Storage, public waypointService: WaypointService) {
		// listen for app coming online and send any checkins/new waypoints created while offline
		document.addEventListener("online", () => this.syncCurrentAssignment.call(this), false);
		window.addEventListener("online", () => this.syncCurrentAssignment.call(this), false);
	}

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
						debugger
						let assignment: Assignment = response.json() as Assignment;
						// server will return NULL if there are no further assignments
						this.updateStoredCurrentAssignment(assignment);
						return assignment;
					})
					.catch(error => {
						if(error.status === 0) {
							return Observable.fromPromise(this.storage.get("currentAssignment"));
						} else {
							throw(error);
						}
					});
			});
	}

	/*
	  Update storage after updates (e.g. to waypoints)
	*/
	updateStoredCurrentAssignment(assignment: Assignment): Promise<any> {
		return this.storage.set("currentAssignment", assignment);
	}

	/*
	  Sync dirty waypoints on current assignment with the backend
	*/
	syncCurrentAssignment(): Promise<any> {
		if(this.storage)
		{
			return this.storage.get("currentAssignment")
				.then((assignment) => {
					// call WaypointService.update on each on that is dirty
					for(let wp of assignment.order.waypoints.filter(w => w.dirty))
					{
						this.waypointService.update(wp).subscribe(() => {
							wp.dirty = false;
						});
					}
					// store updated assignment (which should have no dirties)
					return this.updateStoredCurrentAssignment(assignment);
				})
		}
		else
		{
			return Promise.resolve();
		}
	}
}
