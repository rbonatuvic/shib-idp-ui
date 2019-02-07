import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Admin } from '../model/admin';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { AdminEntity } from '../model/admin-entity';

@Injectable()
export class AdminService {

    private endpoint = '/admin/users';
    private base = '/api';

    constructor(
        private http: HttpClient
    ) { }
    query(): Observable<Admin[]> {
        return this.http.get<Admin[]>(
            `${this.base}${this.endpoint}`, {}
        ).pipe(
            map(users => users.map(u => new AdminEntity(u)))
        );
    }

    queryByRole(role: string): Observable<Admin[]> {
        return this.http.get<Admin[]>(
            `${this.base}${this.endpoint}/role/${role}`, {}
        ).pipe(
            map(users => users.map(u => new AdminEntity(u)))
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
