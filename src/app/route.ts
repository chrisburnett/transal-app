import { Waypoint } from './waypoint';
import { Client } from './client';

export class Route {
	id: string;
	name: string;
	client: Client;
	waypoints: Waypoint[];
	starting_waypoint: Waypoint;

	static getNextWaypoint(route): Waypoint {
		return route.waypoints.filter(wp => wp.id == Route.getCurrentWaypoint(route).next_waypoint_id)[0];
	}

	static getCurrentWaypoint(route): Waypoint {
		let prevWP = Route.getPreviousWaypoint(route);
		if(!prevWP)
		{
			return route.starting_waypoint;
		}
		else
		{
			return prevWP.next_waypoint;
		}
	}

	static getPreviousWaypoint(route): Waypoint {
		if(route.waypoints.length === 0)
		{
			return null;
		}
		return route.waypoints
			.filter(wp => wp.actual_departure_date != null)
			.sort((wpA, wpB) => new Date(wpB.actual_departure_date).valueOf() - new Date(wpA.actual_departure_date).valueOf())[0]; 
	}
}
