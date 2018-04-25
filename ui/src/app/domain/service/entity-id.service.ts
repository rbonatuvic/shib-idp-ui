import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concat';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IDS } from '../../../data/ids.mock';
import { Storage } from '../../shared/storage';
import { environment } from '../../../environments/environment';
import { QueryParams } from '../../core/model/query';
import { MDUI } from '../model/mdui';
import * as XmlFormatter from 'xml-formatter';

const MOCK_INTERVAL = 500;

@Injectable()
export class EntityIdService {

    private searchEndpoint = '/EntityIds/search';
    private entitiesEndpoint = '/entities';
    private base = '/api';

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
            .map(resp => resp.entityIds)
            .catch(err => {
                console.log('ERROR LOADING IDS:', err);
                return Observable.of([] as string[]);
            });
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
            .map(entity => entity.mdui as MDUI);
    }
}
