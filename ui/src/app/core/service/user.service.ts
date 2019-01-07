import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

    readonly base = `/api`;

    constructor(
        private http: HttpClient
    ) { }

    get(): Observable<User> {
        const defUser = Object.assign({}, {
            id: 'foo',
            role: 'admin',
            name: {
                first: 'Ryan',
                last: 'Mathis'
            }
        });
        return of(defUser);
    }

    getRoles(): Observable<string[]> {
        return this.http.get<string[]>(
            `${this.base}/supportedRoles`
        );
    }
} /* istanbul ignore next */
