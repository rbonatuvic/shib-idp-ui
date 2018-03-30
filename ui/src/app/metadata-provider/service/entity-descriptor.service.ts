import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concat';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { MOCK_DESCRIPTORS } from '../../../data/descriptors.mock';
import { Storage } from '../../shared/storage';
import { environment } from '../../../environments/environment';

@Injectable()
export class EntityDescriptorService {

    private endpoint = '/EntityDescriptor';
    private base = '/api';

    constructor(
        private http: HttpClient
    ) {}
    query(): Observable<MetadataProvider[]> {
        return this.http
            .get<MetadataProvider[]>(`${ this.base }${ this.endpoint }s`)
            .catch(err => {
                console.log('ERROR LOADING PROVIDERS:', err);
                return Observable.of([] as MetadataProvider[]);
            });
    }

    find(id: string): Observable<MetadataProvider> {
        return this
            .http
            .get<MetadataProvider>(`${ this.base }${ this.endpoint }/${ id }`)
            .catch(err => Observable.throw(err));
    }

    update(provider: MetadataProvider): Observable<MetadataProvider> {
        return this.http.put<MetadataProvider>(`${this.base}${this.endpoint}/${provider.id}`, provider);
    }

    save(provider: MetadataProvider): Observable<MetadataProvider> {
        if (!environment.production) {
            console.log(JSON.stringify(provider));
        }
        return this.http.post<MetadataProvider>(`${this.base}${this.endpoint}`, provider);
    }

    remove(provider: MetadataProvider): Observable<MetadataProvider> {
        return this.http.delete<MetadataProvider>(`${this.base}${this.endpoint}/${provider.id}`);
    }

    upload(name: string, xml: string): Observable<MetadataProvider> {
        return this.http.post<MetadataProvider>(`${this.base}${this.endpoint}`, xml, {
            headers: new HttpHeaders().set('Content-Type', 'application/xml'),
            params: new HttpParams().set('spName', name)
        });
    }

    createFromUrl(name: string, url: string): Observable<MetadataProvider> {
        let body = `metadataUrl=${url}`;
        return this.http.post<MetadataProvider>(`${this.base}${this.endpoint}`, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            params: new HttpParams().set('spName', name)
        });
    }

    preview(provider: MetadataProvider): Observable<string> {
        return this.http.get(`${this.base}${this.endpoint}/${provider.id}`, {
            headers: new HttpHeaders({
                'Accept': 'application/xml'
            }),
            responseType: 'text'
        });
    }

    removeNulls(attribute): any {
        if (!attribute) { return {}; }
        return Object.keys(attribute).reduce((coll, val, index) => {
            if (attribute[val]) {
                coll[val] = attribute[val];
            }
            return coll;
        }, {});
    }
}
