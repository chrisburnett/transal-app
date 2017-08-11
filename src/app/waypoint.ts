import { Location } from './location';
import { Trailer } from './trailer';

export class Waypoint {
	location: Location;
	trailer: Trailer;
	scheduled_date: Date;
	actual_date: Date;
	status: string;
	activity: string;
	cargo: string;
	scheduled: boolean;
}
