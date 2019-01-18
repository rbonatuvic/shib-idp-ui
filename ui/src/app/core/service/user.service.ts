import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

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
            `${this.base}/user`
        ).pipe(
            catchError(err => of({
                username: 'abc123',
                firstName: 'Foo',
                lastName: 'Bar',
                role: 'ROLE_USER',
                emailAddress: 'foo@unicon.net'
            } as User))
        );
    }
} /* istanbul ignore next */
