import { Component, Pipe, PipeTransform } from '@angular/core';

import { NgForOf } from '@angular/common';

import { ViewController, NavParams } from 'ionic-angular';

import { Order } from '../../order';

@Component({
	templateUrl: 'order-notes-modal.html'
})
export class OrderNotesModal {

	public order: Order;
	public orderHasWaypointNote: boolean;
	
	constructor(public viewCtrl: ViewController, public params: NavParams)
	{
		this.order = this.params.get("order");
		this.orderHasWaypointNote = this.order.waypoints.some((wp) => {
			return wp.notes != "";
		});
	}
	
}

@Pipe({
    name: 'onlyWpsWithNotes',
})
export class FilterEmptyWPNotes {

    transform(objects: any[]): any[] {
        if(objects) {
            return objects.filter(object => {
                return object.notes && object.notes != "";
            });
        }
    }

}
