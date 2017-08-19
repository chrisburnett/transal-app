import { Inject } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';

import { AuthService } from '../providers/auth-service/auth-service';
import { APP_CONFIG } from './app.config';  

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	rootPage:any = LoginPage;
	
	constructor(@Inject(APP_CONFIG) private config, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthService, public translate: TranslateService) {
		platform.ready().then(() => {
			statusBar.styleDefault();
			authService.getCurrentUser().then((user) => {
				if(user) this.rootPage = HomePage;
			});
			splashScreen.hide();
			translate.setDefaultLang(config.lang);
			translate.use(config.lang);
			
		});
	}
}

