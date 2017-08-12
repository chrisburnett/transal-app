import { Waypoint } from './waypoint';
import { Client } from './client';

export class Route {
	name: string;
	client: Client;
	waypoints: Waypoint[];

	static getCurrentWaypoint(route): Waypoint {
		return route.waypoints
			.filter(wp => wp.status == "pending")
			.sort((wpA, wpB) => new Date(wpA.scheduled_date).valueOf() - new Date(wpB.scheduled_date).valueOf())[0];
	}
}
