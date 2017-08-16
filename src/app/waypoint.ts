import { Location } from './location';
import { Trailer } from './trailer';

export class Waypoint {
	id: Number;
	location: Location;
	trailer: Trailer;
	scheduled_date: Date;
	actual_date: Date;
	activity: string;
	cargo: string;
	scheduled: boolean;
}
