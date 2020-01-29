import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Admin } from '../model/admin';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import API_BASE_PATH from '../../app.constant';

@Injectable()
export class AdminService {

    private endpoint = '/admin/users';
    private base = API_BASE_PATH;

    constructor(
        private http: HttpClient
    ) { }
    query(): Observable<Admin[]> {
        return this.http.get<Admin[]>(
            `${this.base}${this.endpoint}`, {}
        );
    }

    queryByRole(role: string): Observable<Admin[]> {
        return this.http.get<Admin[]>(
            `${this.base}${this.endpoint}/role/${role}`, {}
        );
    }

    update(user: Admin): Observable<Admin> {
        return this.http.patch<Admin>(
            `${this.base}${this.endpoint}/${user.username}`, {...user}
        );
    }

    remove(userId: string): Observable<boolean> {
        return this.http.delete<Admin>(
            `${this.base}${this.endpoint}/${userId}`
        ).pipe(
            map(response => !!response),
            catchError(() => of(false))
        );
    }
}
