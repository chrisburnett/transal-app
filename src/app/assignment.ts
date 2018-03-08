import { Order } from './order';
import { DriverTruckAssignment } from './driver-truck-assignment';

export class Assignment {
	order: Order;
	driver_truck_assignment: DriverTruckAssignment;
	reference: string;
	priority: number;
	year: number;
}
