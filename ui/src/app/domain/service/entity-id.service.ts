import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import * as XmlFormatter from 'xml-formatter';

import { Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IDS } from '../../../data/ids.mock';
import { Storage } from '../../shared/storage';
import { environment } from '../../../environments/environment';
import { QueryParams } from '../../core/model/query';
import { MDUI } from '../model/mdui';

const MOCK_INTERVAL = 500;

@Injectable()
export class EntityIdService {

    readonly searchEndpoint = '/EntityIds/search';
    readonly entitiesEndpoint = '/entities';
    readonly base = '/api';

    private subj: Subject<string[]> = new Subject();

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
