import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { API_BASE_PATH } from '../../app.constant';

@Injectable()
export class UserService {

    readonly base = API_BASE_PATH;

    constructor(
        private http: HttpClient
    ) { }

    getRoles(): Observable<string[]> {
        return this.http.get<string[]>(
            `${this.base}/supportedRoles`
        );
    }

    getCurrentUser(): Observable<User> {
        return this.http.get<User>(
            `${this.base}/admin/users/current`
        );
    }
} /* istanbul ignore next */
