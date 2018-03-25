import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { AutoCompleteModule } from 'ionic2-auto-complete';

import { MyApp } from './app.component';
import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';
import { WaypointFormPage } from './pages/waypoint-form/waypoint-form';
import { CurrentWaypoint } from './pages/home/current-waypoint';
import { WaypointPanel } from './pages/home/waypoint-panel';
import { PalletRecordFields } from './pages/waypoint-form/pallet-record-fields';
import { LocationSearchModal } from './pages/location-search-modal/location-search-modal';
import { AuthService } from '../providers/auth-service/auth-service';
import { AssignmentService } from '../providers/assignment-service/assignment-service';
import { WaypointService } from '../providers/waypoint-service/waypoint-service';
import { LocationService } from '../providers/location-service/location-service';

import { AuthHttp } from 'angular2-jwt';
import { APP_CONFIG, AppConfig } from './app.config';

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		MyApp,
		HomePage,
		LoginPage,
		WaypointFormPage,
		CurrentWaypoint,
		WaypointPanel,
		LocationSearchModal,
		PalletRecordFields
	],
	imports: [
		BrowserModule,
		HttpModule,
		IonicModule.forRoot(MyApp),	
		IonicStorageModule.forRoot(),
		FormsModule,
		TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        }),
		AutoCompleteModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
		LoginPage,
		WaypointFormPage,
		CurrentWaypoint,
		LocationSearchModal
		WaypointPanel,
	],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		{ provide: APP_CONFIG, useValue: AppConfig },
		AuthService,
		AssignmentService,
		WaypointService,
		LocationService,
		AuthHttp,
		Network,
		Geolocation
	]
})
export class AppModule {}
