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

    getRoles(): Observable<string[]> {
        return this.http.get<string[]>(
            `${this.base}/supportedRoles`
        );
    }
} /* istanbul ignore next */
