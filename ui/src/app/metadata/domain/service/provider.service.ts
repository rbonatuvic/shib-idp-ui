import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MetadataProvider } from '../../domain/model';
import { FileBackedHttpMetadataProvider } from '../model/providers';

@Injectable()
export class MetadataProviderService {

    readonly endpoint = '/MetadataResolvers';
    readonly base = '/api';

    constructor(
        private http: HttpClient
    ) {}
    query(): Observable<MetadataProvider[]> {
        return this.http.get<MetadataProvider[]>(`${this.base}${this.endpoint}`, {});
    }

    find(id: string): Observable<MetadataProvider> {
        // console.log(id);
        return this.http.get<MetadataProvider>(`${this.base}${this.endpoint}/${id}`);
    }

    update(provider: MetadataProvider): Observable<MetadataProvider> {
        return this.http.put<MetadataProvider>(`${this.base}${this.endpoint}/${provider.resourceId}`, provider);
    }

    save(provider: MetadataProvider): Observable<MetadataProvider> {
        const { metadataFilters, id, ...pruned } = provider as FileBackedHttpMetadataProvider;
        return this.http.post<MetadataProvider>(`${this.base}${this.endpoint}`, pruned);
    }
}
