import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken('app.config');

export interface IAppConfig {
    apiEndpoint: string;
	lang: string;
}

export const AppConfig: IAppConfig = {
	apiEndpoint: "localhost:3000/api/v1",
	lang: 'en'
}
