import { Waypoint } from './waypoint';
import { Client } from './client';

export class Order {
	id: string;
	client_reference: string;
	client: Client;
	waypoints: Waypoint[];
	starting_waypoint: Waypoint;
	enforce_pallet_exchange: boolean;
	notes: string;

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

	static getPreviousWaypoints(order): Waypoint[] {
		if(order.waypoints.length === 0)
		{
			return null;
		}
		return order.waypoints
			.filter(wp => wp.actual_departure_date != null)
			.sort((wpA, wpB) => wpA.position - wpB.position);
	}
	
	static getNextWaypoints(order): Waypoint[] {
		if(order.waypoints.length === 0)
		{
			return null;
		}
		return order.waypoints
			.filter(wp => wp.actual_departure_date == null)
			.sort((wpA, wpB) => wpA.position - wpB.position)
			.slice(1) // don't include the current WP
		
	}
	
	static getPreviousWaypoint(order): Waypoint {
		const wps = this.getPreviousWaypoints(order);
		return wps[wps.length-1];
	}

	
	
}
