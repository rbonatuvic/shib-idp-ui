import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MetadataResolver } from '../../domain/model';
import { Storage } from '../../../shared/storage';

@Injectable()
export class EntityDraftService {

    readonly storage: Storage<MetadataResolver>;

    constructor() {
        this.storage = new Storage<MetadataResolver>('provider_drafts');
    }
    query(): Observable<MetadataResolver[]> {
        return of(this.storage.query());
    }

    find(entityId: string): Observable<MetadataResolver> {
        return this.query().pipe(
            switchMap(
                list => of(
                    list.find(entity => entity.entityId === entityId)
                )
            )
        );
    }

    save(provider: MetadataResolver): Observable<MetadataResolver> {
        this.storage.add(provider);
        return of(provider);
    }

    remove(provider: MetadataResolver): Observable<MetadataResolver> {
        this.storage.removeByAttr(provider.entityId, 'entityId');
        return of(provider);
    }

    update(provider: MetadataResolver): Observable<MetadataResolver> {
        let stored = this.storage.findByAttr(provider.id, 'entityId');
        stored = Object.assign({}, stored, provider);
        this.storage.removeByAttr(provider.entityId, 'entityId');
        this.storage.add(stored);
        return of(stored);
    }
} /* istanbul ignore next */
