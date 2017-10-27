import { Location } from './location';
import { Trailer } from './trailer';
import { Reading } from './reading';

export class Waypoint {
	id: Number;
	location_attributes: Location;
	location_id: string;
	trailer: Trailer;
	scheduled_date: Date;
	actual_date: Date;
	activity: string;
	cargo: string;
	scheduled: boolean;
	additional_km: Number;
	litres_diesel: Number;
	price_per_litre: Number;
	additional_km_reason: string;
	reading_attributes: Reading;
	route_id: string;
	read: boolean;
}
