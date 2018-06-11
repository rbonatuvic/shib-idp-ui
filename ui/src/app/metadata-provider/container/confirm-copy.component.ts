import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import * as fromProvider from '../reducer';
import { MetadataProvider } from '../../domain/domain.type';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProviderValueEmitter } from '../../domain/service/provider-change-emitter.service';
import { UpdateProviderCopy } from '../action/copy.action';
import { map, take } from 'rxjs/operators';
import { AddProviderRequest } from '../../domain/action/provider-collection.action';

@Component({
    selector: 'confirm-copy-page',
    templateUrl: './confirm-copy.component.html',
    styleUrls: ['./confirm-copy.component.scss']
})
export class ConfirmCopyComponent {

    copy$: Observable<MetadataProvider>;
    values$: Observable<MetadataProvider>;
    saving$: Observable<boolean>;

    provider: MetadataProvider;

    constructor(
        private store: Store<fromProvider.State>,
        private valueEmitter: ProviderValueEmitter
    ) {
        this.copy$ = this.store.select(fromProvider.getCopy);
        this.saving$ = this.store.select(fromProvider.getSaving);

        this.values$ = this.copy$.pipe(take(1));
        this.valueEmitter.changeEmitted$.subscribe(changes => this.store.dispatch(new UpdateProviderCopy(changes)));

        this.copy$.subscribe(p => this.provider = p);
    }

    onSave(provider: MetadataProvider): void {
        this.store.dispatch(new AddProviderRequest(provider));
    }
} /* istanbul ignore next */
