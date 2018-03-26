import { LocationNote } from './location-note';

export class Location {
	id: string;
	code: string;
	name: string;
	coords: string;
	street: string;
	number: string;
	city: string;
	postcode: string;
	country_code: string;
	last_revision_whodunnit: string;
	last_revision_date: string;
	notes: string;
	location_notes: [LocationNote];
	location_notes_attributes: [LocationNote];
}
