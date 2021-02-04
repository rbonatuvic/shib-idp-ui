import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MetadataFilter } from '../../domain/model';
import API_BASE_PATH from '../../../app.constant';

@Injectable()
export class MetadataFilterService {

    readonly endpoint = '/MetadataResolvers';
    readonly order = 'FiltersPositionOrder';
    readonly base = API_BASE_PATH;
    readonly path = 'Filters';

    constructor(
        private http: HttpClient
    ) { }
    query(providerId: string): Observable<MetadataFilter[]> {
        return this.http.get<MetadataFilter[]>(`${this.base}${this.endpoint}/${providerId}/${this.path}`);
    }

    find(providerId: string, filterId: string): Observable<MetadataFilter> {
        return this.http.get<MetadataFilter>(`${this.base}${this.endpoint}/${providerId}/${this.path}/${filterId}`);
    }

    update(providerId: string, filter: MetadataFilter): Observable<MetadataFilter> {
        return this.http.put<MetadataFilter>(`${this.base}${this.endpoint}/${providerId}/${this.path}/${ filter.resourceId }`, filter);
    }

    save(providerId: string, filter: MetadataFilter): Observable<MetadataFilter> {
        return this.http.post<MetadataFilter>(`${this.base}${this.endpoint}/${providerId}/${this.path}`, filter);
    }

    getOrder(providerId: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.base}${this.endpoint}/${providerId}/${this.order}`);
    }

    setOrder(providerId: string, order: string[]): Observable<string[]> {
        return this.http.post<string[]>(`${this.base}${this.endpoint}/${providerId}/${this.order}`, order);
    }

    remove(providerId: string, filterId: string): Observable<string> {
        return this.http.delete<string>(`${this.base}${this.endpoint}/${providerId}/${this.path}/${filterId}`);
    }
}
