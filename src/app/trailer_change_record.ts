import { Waypoint } from './waypoint';
import { Trailer } from './trailer';

export class TrailerChangeRecord {
	id: number;
	trailer: Trailer;
	trailer_id: string;
	waypoint: Waypoint;
	waypoint_id: string;
}
