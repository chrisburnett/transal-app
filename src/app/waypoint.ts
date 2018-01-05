import { Location } from './location';
import { Trailer } from './trailer';
import { Reading } from './reading';
import { Offline } from './offline';

export class Waypoint implements Offline {
	id: Number;
	location_attributes: Location;
	location_id: string;
	trailer: Trailer;
	confirm_leaving_trailer: Number;
	confirm_pickup_trailer: Number;
	scheduled_date: Date;
	actual_date: Date;
	actual_departure_date: Date;
	gps_location_lat: string;
	gps_location_long: string;
	activity: string;
	cargo: string;
	scheduled: boolean;
	additional_km: Number;
	litres_diesel: Number;
	price_per_litre: Number;
	additional_km_reason: string;
	reading_attributes: Reading;
	order_id: string;
	read: boolean;
	dirty: boolean;
	next_waypoint_id: Number;
	next_waypoint: Waypoint;
}
