import { Order } from './order';
import { Truck } from './truck';

export class Assignment {
	order: Order;
	truck: Truck;
	truck_id: string;
	start_date: Date;
	end_date: Date;
}
