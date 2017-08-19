import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Waypoint } from '../../waypoint';

@IonicPage()
@Component({
	selector: 'page-waypoint-form',
	templateUrl: 'waypoint-form.html',
})
export class WaypointFormPage implements OnInit {

	waypoint: Waypoint;
	
	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ngOnInit(): void {
		this.waypoint = new Waypoint();
	}
	
}
