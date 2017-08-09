import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';

import { AuthService } from './services/auth-service';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild('rootNavController') nav: NavController;
	rootPage:any = LoginPage;
	
	constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthService) {
		platform.ready().then(() => {
			statusBar.styleDefault();
			if(authService.getCurrentUser()) {
				this.rootPage = HomePage;
			}
			splashScreen.hide();
			
			
		});
	}
}

