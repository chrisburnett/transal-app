import { User } from './user';
import { Truck } from './truck';

export class DriverTruckAssignment {
	user: User;
	truck: Truck;
	start_date: Date;
	end_date: Date;
	avg_consumption: number;
	trip_distance: number;
}
