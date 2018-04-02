import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken('app.config');

export interface IAppConfig {
    apiEndpoint: string;
	lang: string;
	activityIconMap: Object;
}

export const AppConfig: IAppConfig = {
	apiEndpoint: "localhost:3000/api/v1",
	//apiEndpoint: "hidden-caverns-63006.herokuapp.com/api/v1",
	lang: 'pl',
	activityIconMap: {
		"PICKUP": "arrow-up",
		"DELIVER": "arrow-down",
		"SERVICE": "build",
		"FUEL": "color-fill",
		"OFFICE": "home",
		"HANDOVER": "home",
		"TRAILER_CHANGE": "swap",
		"TRUCK_WASH": "swap"
	}
}
