
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MetadataFilter } from '../../domain/model/metadata-filter';
import { MOCK_DESCRIPTORS } from '../../../data/descriptors.mock';
import { Storage } from '../../shared/storage';
import { environment } from '../../../environments/environment';
import { Filter } from '../entity/filter';

@Injectable()
export class MetadataResolverService {

    readonly endpoint = '/MetadataResolver/incommon/Filter';
    readonly base = '/api';

    constructor(
        private http: HttpClient
    ) {}
    query(): Observable<MetadataFilter[]> {
        return this.http.get<MetadataFilter[]>(`${this.base}${this.endpoint}s`, {});
    }

    find(id: string): Observable<MetadataFilter> {
        return this.http.get<MetadataFilter>(`${this.base}${this.endpoint}/${id}`);
    }

    update(filter: MetadataFilter): Observable<MetadataFilter> {
        return this.http.put<MetadataFilter>(`${this.base}${this.endpoint}/${filter.id}`, filter);
    }

    save(filter: MetadataFilter): Observable<MetadataFilter> {
        return this.http.post<MetadataFilter>(`${this.base}${this.endpoint}`, filter);
    }
}
