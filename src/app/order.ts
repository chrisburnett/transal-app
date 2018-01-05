import { Waypoint } from './waypoint';
import { Client } from './client';

export class Order {
	id: string;
	name: string;
	client: Client;
	waypoints: Waypoint[];
	starting_waypoint: Waypoint;

	static getNextWaypoint(order): Waypoint {
		return order.waypoints.filter(wp => wp.id == Order.getCurrentWaypoint(order).next_waypoint_id)[0];
	}

	static getCurrentWaypoint(order): Waypoint {
		let prevWP = Order.getPreviousWaypoint(order);
		if(!prevWP)
		{
			return order.starting_waypoint;
		}
		else
		{
			return prevWP.next_waypoint;
		}
	}

	static getPreviousWaypoint(order): Waypoint {
		if(order.waypoints.length === 0)
		{
			return null;
		}
		return order.waypoints
			.filter(wp => wp.actual_departure_date != null)
			.sort((wpA, wpB) => new Date(wpB.actual_departure_date).valueOf() - new Date(wpA.actual_departure_date).valueOf())[0]; 
	}
}
