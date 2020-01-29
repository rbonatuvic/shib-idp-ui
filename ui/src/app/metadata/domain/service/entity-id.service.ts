import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { QueryParams } from '../../../core/model/query';
import { MDUI } from '../model';
import API_BASE_PATH from '../../../app.constant';

@Injectable()
export class EntityIdService {

    readonly searchEndpoint = '/EntityIds/search';
    readonly entitiesEndpoint = '/entities';
    readonly base = API_BASE_PATH;

    constructor(
        private http: HttpClient
    ) { }

    query(q: QueryParams): Observable<string[]> {
        let params: HttpParams = new HttpParams();
        Object.keys(q).forEach(key => params = params.set(key, q[key]));
        const opts = { params: params };
        return this.http
            .get<any>(`${this.base}${this.searchEndpoint}`, opts)
            .pipe(
                map(resp => resp.entityIds),
                catchError(err => throwError([]))
            );
    }

    preview(id: string): Observable<any> {
        return this.http
            .get(`${this.base}${this.entitiesEndpoint}/${encodeURIComponent(id)}`, {
                headers: new HttpHeaders({
                    'Accept': 'application/xml'
                }),
                responseType: 'text'
            });
    }

    findEntityById(id: string): Observable<MDUI> {
        return this.http
            .get<any>(`${this.base}${this.entitiesEndpoint}/${encodeURIComponent(id)}`)
            .pipe(
                map(entity => entity.mdui as MDUI)
            );
    }
}
