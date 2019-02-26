import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MetadataProvider } from '../../domain/model';


@Injectable()
export class MetadataProviderService {

    readonly endpoint = '/MetadataResolvers';
    readonly order = '/MetadataResolversPositionOrder';
    readonly base = '/api';

    constructor(
        private http: HttpClient
    ) {}
    query(): Observable<MetadataProvider[]> {
        return this.http.get<MetadataProvider[]>(`${this.base}${this.endpoint}`).pipe(
            map(providers => providers.filter(p => p['@type'] !== 'BaseMetadataResolver')),
            map(providers => providers.map(p => ({ ...p, id: p.resourceId })))
        );
    }

    find(id: string): Observable<MetadataProvider> {
        return this.http.get<MetadataProvider>(`${this.base}${this.endpoint}/${id}`).pipe(map(
            provider => {
                /*if (provider.reloadableMetadataResolverAttributes) {
                    if (provider.reloadableMetadataResolverAttributes.refreshDelayFactor) {
                        provider.reloadableMetadataResolverAttributes.refreshDelayFactor =
                            provider.reloadableMetadataResolverAttributes.refreshDelayFactor.toString();
                    }
                }*/
                return provider;
            }
        ));
    }

    update(provider: MetadataProvider): Observable<MetadataProvider> {
        return this.http.put<MetadataProvider>(`${this.base}${this.endpoint}/${provider.resourceId}`, provider);
    }

    save(provider: MetadataProvider): Observable<MetadataProvider> {
        return this.http.post<MetadataProvider>(`${this.base}${this.endpoint}`, provider);
    }

    getOrder(): Observable<string[]> {
        return this.http.get<{ [resourceIds: string]: string[] }>(`${this.base}${this.order}`).pipe(
            map(
                (order: {[resourceIds: string]: string[]}) => order.resourceIds
            )
        );
    }

    setOrder(order: string[]): Observable<string[]> {
        return this.http.post<string[]>(`${this.base}${this.order}`, { resourceIds: order });
    }
}
