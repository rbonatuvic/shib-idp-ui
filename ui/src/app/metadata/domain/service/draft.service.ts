import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
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

    find(id: string, attr: string = 'id'): Observable<MetadataResolver> {
        if (!id) {
            return throwError(404);
        }
        return this.query().pipe(
            switchMap(
                list => of(list.find(entity => entity[attr] === id))
            )
        );
    }

    save(provider: MetadataResolver): Observable<MetadataResolver> {
        this.storage.add(provider);
        return of(provider);
    }

    remove(provider: MetadataResolver): Observable<MetadataResolver> {
        this.storage.removeByAttr(provider.id, 'id');
        return of(provider);
    }

    update(provider: MetadataResolver): Observable<MetadataResolver> {
        let stored = this.storage.findByAttr(provider.id, 'id');
        if (stored) {
            stored = { ...stored, ...provider };
            this.storage.removeByAttr(provider.id, 'id');
            this.storage.add(stored);
            return of(stored);
        } else {
            return throwError(404);
        }
    }
} /* istanbul ignore next */
