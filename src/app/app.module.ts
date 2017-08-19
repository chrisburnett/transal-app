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

import { MyApp } from './app.component';
import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';
import { WaypointFormPage } from './pages/waypoint-form/waypoint-form';
import { AuthService } from '../providers/auth-service/auth-service';
import { AssignmentService } from '../providers/assignment-service/assignment-service';
import { WaypointService } from '../providers/waypoint-service/waypoint-service';

import { AuthHttp } from 'angular2-jwt';
import { APP_CONFIG, AppConfig } from './app.config';

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		MyApp,
		HomePage,
		LoginPage,
		WaypointFormPage
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
        })
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
		LoginPage,
		WaypointFormPage
	],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		{ provide: APP_CONFIG, useValue: AppConfig },
		AuthService,
		AssignmentService,
		WaypointService,
		AuthHttp
	]
})
export class AppModule {}
