import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { APP_CONFIG } from '../../app/app.config';
import { Http, Headers } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { User } from '../../app/user';

import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/toPromise';

/*
  Needs to authenticate with given credentials and return token, or
  just return token if logged in
 */
@Injectable()
export class AuthService {
	constructor(@Inject(APP_CONFIG) private config, private http: Http, private storage: Storage) { }

	jwtHelper: JwtHelper = new JwtHelper();
	
	authenticate(username: string, password: string): Observable<AuthServiceResponse> {
		const url = `http://${this.config.apiEndpoint}/auth`;
		let headers: Headers = new Headers();
		headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
		return this.http.get(url, {headers: headers})
			.map(response => {
				let tokenResponse: AuthServiceResponse = response.json();
				this.storage.set("token", tokenResponse.auth_token)
				return this.jwtHelper.decodeToken(tokenResponse.auth_token);
			});
	}

	getCurrentUser(): Promise<User> {
		return this.storage.get("token")
			.then((token) => {
				if(token) {
					return this.jwtHelper.decodeToken(token) as User;
				}
			});
	}

	logout(): void {
		this.storage.remove("token");
	}
}

export class AuthServiceResponse {
	auth_token: string
}
