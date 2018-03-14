import { Waypoint } from './waypoint';
import { Truck } from './truck';

export class Reading {
	odometer: number;
	maut: number;
	waypoint: Waypoint;
	truck: Truck;
	truck_id: string;
	user_id: string;
}
