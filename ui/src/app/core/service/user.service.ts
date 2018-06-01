import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../model/user';

@Injectable()
export class UserService {

    constructor() { }

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
} /* istanbul ignore next */
