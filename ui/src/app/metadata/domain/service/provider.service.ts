import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MetadataProvider } from '../../domain/model';
import { FileBackedHttpMetadataProvider } from '../model/providers';
import { ProviderOrder } from '../model/metadata-order';

@Injectable()
export class MetadataProviderService {

    readonly endpoint = '/MetadataResolvers';
    readonly order = '/MetadataResolversPositionOrder';
    readonly base = '/api';

    constructor(
        private http: HttpClient
    ) {}
    query(): Observable<MetadataProvider[]> {
        return this.http.get<MetadataProvider[]>(`${this.base}${this.endpoint}`, {});
    }

    find(id: string): Observable<MetadataProvider> {
        return this.http.get<MetadataProvider>(`${this.base}${this.endpoint}/${id}`);
    }

    update(provider: MetadataProvider): Observable<MetadataProvider> {
        return this.http.put<MetadataProvider>(`${this.base}${this.endpoint}/${provider.resourceId}`, provider);
    }

    save(provider: MetadataProvider): Observable<MetadataProvider> {
        return this.http.post<MetadataProvider>(`${this.base}${this.endpoint}`, provider);
    }

    getOrder(): Observable<ProviderOrder> {
        return this.http.get<ProviderOrder>(`${this.base}${this.order}`);
    }

    setOrder(order: ProviderOrder): Observable<ProviderOrder> {
        return this.http.post<ProviderOrder>(`${this.base}${this.order}`, order);
    }
}
