import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MetadataFilter } from '../../domain/model';

@Injectable()
export class MetadataFilterService {

    readonly endpoint = '/MetadataResolvers';
    readonly base = '/api';

    constructor(
        private http: HttpClient
    ) { }
    query(providerId: string): Observable<MetadataFilter[]> {
        return this.http.get<MetadataFilter[]>(`${this.base}${this.endpoint}/${providerId}/Filters`);
    }

    find(providerId: string, filterId: string): Observable<MetadataFilter> {
        return this.http.get<MetadataFilter>(`${this.base}${this.endpoint}/${providerId}/Filters/${ filterId }`);
    }

    update(providerId: string, filter: MetadataFilter): Observable<MetadataFilter> {
        return this.http.put<MetadataFilter>(`${this.base}${this.endpoint}/${providerId}/Filters/${ filter.resourceId }`, filter);
    }

    save(providerId: string, filter: MetadataFilter): Observable<MetadataFilter> {
        return this.http.post<MetadataFilter>(`${this.base}${this.endpoint}/${providerId}/Filters`, filter);
    }

    remove(providerId: string, filterId: string): Observable<string> {
        return this.http.delete<string>(`${this.base}${this.endpoint}/${providerId}/Filters/${ filterId }`);
    }
}
