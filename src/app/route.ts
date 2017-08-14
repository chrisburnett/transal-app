import { Waypoint } from './waypoint';
import { Client } from './client';

export class Route {
	name: string;
	client: Client;
	waypoints: Waypoint[];

	static getNextWaypoint(route): Waypoint {
		if(route.waypoints.length === 0)
		{
			return null;
		}
		return route.waypoints
			.filter(wp => wp.status === "pending")
			.sort((wpA, wpB) => new Date(wpA.scheduled_date).valueOf() - new Date(wpB.scheduled_date).valueOf())[1];
	}
	static getCurrentWaypoint(route): Waypoint {
		if(route.waypoints.length === 0)
		{
			return null;
		}
		return route.waypoints
			.filter(wp => wp.status === "pending")
			.sort((wpA, wpB) => new Date(wpA.scheduled_date).valueOf() - new Date(wpB.scheduled_date).valueOf())[0];
	}

	static getPreviousWaypoint(route): Waypoint {
		if(route.waypoints.length === 0)
		{
			return null;
		}
		return route.waypoints
			.filter(wp => wp.status === "completed")
			.sort((wpA, wpB) => new Date(wpB.scheduled_date).valueOf() - new Date(wpA.scheduled_date).valueOf())[0]; 
	}
}
