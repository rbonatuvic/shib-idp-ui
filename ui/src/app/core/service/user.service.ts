import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class UserService {

    readonly base = `/api`;

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
        // .pipe(map(user => ({ ...user, role: 'ROLE_USER' })));
    }
} /* istanbul ignore next */
