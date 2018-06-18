import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MetadataFilter } from '../../domain/model';

@Injectable()
export class MetadataProviderService {

    readonly endpoint = '/MetadataResolver/incommon/Filters';
    readonly base = '/api';

    constructor(
        private http: HttpClient
    ) {}
    query(): Observable<MetadataFilter[]> {
        return this.http.get<MetadataFilter[]>(`${this.base}${this.endpoint}`, {});
    }

    find(id: string): Observable<MetadataFilter> {
        // console.log(id);
        return this.http.get<MetadataFilter>(`${this.base}${this.endpoint}/${id}`);
    }

    update(filter: MetadataFilter): Observable<MetadataFilter> {
        return this.http.put<MetadataFilter>(`${this.base}${this.endpoint}/${filter.id}`, filter);
    }

    save(filter: MetadataFilter): Observable<MetadataFilter> {
        return this.http.post<MetadataFilter>(`${this.base}${this.endpoint}`, filter);
    }
}
