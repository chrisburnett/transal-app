import { Location } from './location';
import { Trailer } from './trailer';
import { Reading } from './reading';
import { Offline } from './offline';
import { PalletRecord } from './pallet-record';

export class Waypoint implements Offline {
	id: Number;
	location_attributes: Location;
	location: Location;
	location_id: string;
	scheduled_date: Date;
	scheduled_time: string;
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
	pallet_records_attributes: PalletRecord[];
	notes: string;
	order_id: string;
	read: boolean;
	dirty: boolean;
	next_waypoint_id: Number;
	next_waypoint: Waypoint;
	odometer_from_previous: number;
	distance_from_previous: number;
	distance_to_next: number;
	expected_trailer: Trailer;
	actual_trailer: Trailer;
	new_trailer_registration: string;
}
