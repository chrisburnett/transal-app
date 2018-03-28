import { Component, OnInit, Input, Inject } from '@angular/core';
import { Waypoint } from '../../waypoint';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG, AppConfig } from '../../app.config';

import * as moment from 'moment';

@Component({
	selector: 'waypoint-panel',
	templateUrl: 'waypoint-panel.component.html',
	styles: [ '.position-number { color: #CCCCCC; font-weight: bold; }' ]
})
export class WaypointPanel implements OnInit {

	@Input() waypoint: Waypoint;

	public waypointDatestring: string;
	public waypointIconName: string;
	public waypointLocationText: string;
	
	constructor(@Inject(APP_CONFIG) private config, public translate: TranslateService) {}
	
	ngOnInit() {
		if(this.waypoint) {
			if(this.waypoint.actual_departure_date)
			{
				this.waypointDatestring = "Data wyjazadu: " + moment(this.waypoint.actual_departure_date).format("ddd, D MMM YYYY, H:mm:ss a");
			}
			else if(this.waypoint.scheduled_date)
			{
				this.waypointDatestring = "Planowana data: " + moment(this.waypoint.scheduled_date).format("ddd, D MMM YYYY, H:mm:ss a");
			}
			else
			{
				this.waypointDatestring = "";
			}
			this.waypointIconName = this.config.activityIconMap[this.waypoint.activity];
			this.translate.get('HOME.' + this.waypoint.activity.toUpperCase()).subscribe((text: string) => {
				this.waypointLocationText = text;
			});
		}
		
	}
}
	
