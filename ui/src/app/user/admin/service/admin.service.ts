import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Admin } from '../model/admin';

let users = <Admin[]>[
    {
        resourceId: 'abc',
        role: 'SUPER_ADMIN',
        email: 'foo@bar.com',
        name: {
            first: 'Jane',
            last: 'Doe'
        }
    },
    {
        resourceId: 'def',
        role: 'DELEGATED_ADMIN',
        email: 'bar@baz.com',
        name: {
            first: 'John',
            last: 'Doe'
        }
    }
];

@Injectable()
export class AdminService {

    constructor() { }
    query(): Observable<Admin[]> {
        return of([
            ...users
        ]);
    }

    update(user: Admin): Observable<Admin> {
        return of({
            ...users.find(u => u.resourceId === user.resourceId),
            ...user
        });
    }

    remove(userId: string): Observable<boolean> {
        users = users.filter(u => u.resourceId !== userId);
        return of(true);
    }
}
