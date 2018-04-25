
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/concat';


import { MetadataFilter } from '../../domain/model/metadata-filter';
import { MOCK_DESCRIPTORS } from '../../../data/descriptors.mock';
import { Storage } from '../../shared/storage';
import { environment } from '../../../environments/environment';
import { Filter } from '../entity/filter';

@Injectable()
export class MetadataResolverService {

    private endpoint = '/MetadataResolver/incommon/Filter';
    private base = '/api';

    private filters: MetadataFilter[] = [
        new Filter({
            entityId: 'http://unicon.instructure.com/saml2',
            filterName: 'Instructure (Unicon)',
            id: 'instructure',
            filterEnabled: true,
            createdDate: '2018-04-05T09:07:13.730',
            modifiedDate: '2018-04-05T09:07:13.730',
            attributeRelease: ['eduPersonPrincipalName'],
            relyingPartyOverrides: {
                signAssertion: true,
                nameIdFormats: ['urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified'],
                authenticationMethods: []
            }
        }),
        new Filter({
            entityId: 'https://idp.unicon.net/idp/shibboleth',
            filterName: 'Unicon',
            id: 'unicon',
            createdDate: '2018-04-05T09:07:13.730',
            modifiedDate: '2018-04-05T09:07:13.730'
        })
    ];

    constructor(
        private http: HttpClient
    ) {}
    query(): Observable<MetadataFilter[]> {
        return this.http
            .get<MetadataFilter[]>(`${this.base}${this.endpoint}s`)
            .catch(err => {
                console.log('ERROR LOADING PROVIDERS:', err);
                return Observable.of([] as MetadataFilter[]);
            });
    }

    find(id: string): Observable<MetadataFilter> {
        return this
            .http
            .get<MetadataFilter>(`${this.base}${this.endpoint}/${id}`)
            .catch(err => Observable.throw(err));
    }

    update(filter: MetadataFilter): Observable<MetadataFilter> {
        return this.http.put<MetadataFilter>(`${this.base}${this.endpoint}/${filter.id}`, filter);
    }

    save(filter: MetadataFilter): Observable<MetadataFilter> {
        return this.http.post<MetadataFilter>(`${this.base}${this.endpoint}`, filter);
    }
}
