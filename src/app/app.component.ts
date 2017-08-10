import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';

import { AuthService } from '../providers/auth-service/auth-service';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	rootPage:any = LoginPage;
	
	constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthService) {
		platform.ready().then(() => {
			statusBar.styleDefault();
			authService.getCurrentUser().then((user) => {
				if(user) this.rootPage = HomePage;
			});
			splashScreen.hide();
			
			
		});
	}
}

