import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/switchMap';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MetadataProvider } from '../model/metadata-provider';
import { MOCK_DESCRIPTORS } from '../../../data/descriptors.mock';
import { Storage } from '../../shared/storage';

@Injectable()
export class EntityDraftService {

    private storage: Storage<MetadataProvider>;

    constructor(private http: HttpClient) {
        this.storage = new Storage<MetadataProvider>('provider_drafts');
    }
    query(): Observable<MetadataProvider[]> {
        return Observable.of(this.storage.query());
    }

    find(entityId: string): Observable<MetadataProvider> {
        return this.query().switchMap(
            list => Observable.of(
                list.find(entity => entity.entityId === entityId)
            )
        );
    }

    save(provider: MetadataProvider): Observable<MetadataProvider> {
        this.storage.add(provider);
        return Observable.of(provider);
    }

    remove(provider: MetadataProvider): Observable<MetadataProvider> {
        this.storage.removeByAttr(provider.entityId, 'entityId');
        return Observable.of(provider);
    }

    update(provider: MetadataProvider): Observable<MetadataProvider> {
        let stored = this.storage.findByAttr(provider.id, 'entityId');
        stored = Object.assign({}, stored, provider);
        this.storage.removeByAttr(provider.entityId, 'entityId');
        this.storage.add(stored);
        return Observable.of(stored);
    }
} /* istanbul ignore next */
