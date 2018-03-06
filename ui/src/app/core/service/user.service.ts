import 'rxjs/add/observable/of';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user';

@Injectable()
export class UserService {

    constructor(private http: Http) { }

    get(): Observable<User> {
        const defUser = Object.assign({}, {
            id: 'foo',
            role: 'admin',
            name: {
                first: 'Ryan',
                last: 'Mathis'
            }
        });
        return Observable.of(defUser);
    }
} /* istanbul ignore next */
