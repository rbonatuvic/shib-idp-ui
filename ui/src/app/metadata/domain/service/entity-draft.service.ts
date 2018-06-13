import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MetadataProvider } from '../../domain/model/provider';
import { MOCK_DESCRIPTORS } from '../../../data/descriptors.mock';
import { Storage } from '../../shared/storage';

@Injectable()
export class EntityDraftService {

    readonly storage: Storage<MetadataProvider>;

    constructor() {
        this.storage = new Storage<MetadataProvider>('provider_drafts');
    }
    query(): Observable<MetadataProvider[]> {
        return of(this.storage.query());
    }

    find(entityId: string): Observable<MetadataProvider> {
        return this.query().pipe(
            switchMap(
                list => of(
                    list.find(entity => entity.entityId === entityId)
                )
            )
        );
    }

    save(provider: MetadataProvider): Observable<MetadataProvider> {
        this.storage.add(provider);
        return of(provider);
    }

    remove(provider: MetadataProvider): Observable<MetadataProvider> {
        this.storage.removeByAttr(provider.entityId, 'entityId');
        return of(provider);
    }

    update(provider: MetadataProvider): Observable<MetadataProvider> {
        let stored = this.storage.findByAttr(provider.id, 'entityId');
        stored = Object.assign({}, stored, provider);
        this.storage.removeByAttr(provider.entityId, 'entityId');
        this.storage.add(stored);
        return of(stored);
    }
} /* istanbul ignore next */
