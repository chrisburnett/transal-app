import { Waypoint } from './waypoint';
import { Client } from './client';

export class Route {
	name: string;
	client: Client;
	waypoints: Waypoint[];
}
