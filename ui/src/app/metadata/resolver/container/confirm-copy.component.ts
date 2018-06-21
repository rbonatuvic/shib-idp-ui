import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import * as fromProvider from '../reducer';
import { MetadataResolver } from '../../domain/model';
import { ProviderValueEmitter } from '../../domain/service/provider-change-emitter.service';
import { UpdateResolverCopy } from '../action/copy.action';
import { map, take } from 'rxjs/operators';
import { AddResolverRequest } from '../action/collection.action';

@Component({
    selector: 'confirm-copy-page',
    templateUrl: './confirm-copy.component.html',
    styleUrls: ['./confirm-copy.component.scss']
})
export class ConfirmCopyComponent {

    copy$: Observable<MetadataResolver>;
    values$: Observable<MetadataResolver>;
    saving$: Observable<boolean>;

    resolver: MetadataResolver;

    constructor(
        private store: Store<fromProvider.State>,
        private valueEmitter: ProviderValueEmitter
    ) {
        this.copy$ = this.store.select(fromProvider.getCopy);
        this.saving$ = this.store.select(fromProvider.getSaving);

        this.values$ = this.copy$.pipe(take(1));
        this.valueEmitter.changeEmitted$.subscribe(changes => this.store.dispatch(new UpdateResolverCopy(changes)));

        this.copy$.subscribe(p => this.resolver = p);
    }

    onSave(resolver: MetadataResolver): void {
        this.store.dispatch(new AddResolverRequest(resolver));
    }
} /* istanbul ignore next */
