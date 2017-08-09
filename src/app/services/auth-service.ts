import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { APP_CONFIG } from '../app.config';
import { Http, Headers } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/toPromise';

/*
  Needs to authenticate with given credentials and return token, or
  just return token if logged in
 */
@Injectable()
export class AuthService {
	constructor(@Inject(APP_CONFIG) private config, private http: Http) { }

	jwtHelper: JwtHelper = new JwtHelper();
	
	authenticate(username: string, password: string): Observable<AuthServiceResponse> {
		const url = `http://${this.config.apiEndpoint}/auth`;
		let headers: Headers = new Headers();
		headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
		return this.http.get(url, {headers: headers})
			.map(response => {
				let tokenResponse: AuthServiceResponse = response.json();
				localStorage.setItem("token", tokenResponse.auth_token)
				return this.jwtHelper.decodeToken(tokenResponse.auth_token);
			});
	}
}

export class AuthServiceResponse {
	auth_token: string
}
