import { Order } from './order';
import { DriverTruckAssignment } from './driver-truck-assignment';
import { PalletType } from './pallet-type';

export class Assignment {
	order: Order;
	driver_truck_assignment: DriverTruckAssignment;
	reference: string;
	priority: number;
	year: number;
	pallet_types: PalletType[];
}
