import { Component, Inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import {
    State,
    getResolverConfiguration,
    getCopy,
    getSaving
} from '../reducer';
import { MetadataResolver } from '../../domain/model';
import { ProviderValueEmitter } from '../../domain/service/provider-change-emitter.service';
import { UpdateResolverCopy } from '../action/copy.action';
import { take, skipWhile } from 'rxjs/operators';
import { AddResolverRequest } from '../action/collection.action';
import { MetadataConfiguration } from '../../configuration/model/metadata-configuration';
import { SetDefinition, ClearWizard } from '../../../wizard/action/wizard.action';
import { METADATA_SOURCE_WIZARD } from '../wizard-definition';
import { Wizard } from '../../../wizard/model';
import { LoadSchemaRequest } from '../../configuration/action/configuration.action';
import { getCurrentWizardSchema } from '../../../wizard/reducer';

@Component({
    selector: 'confirm-copy-page',
    templateUrl: './confirm-copy.component.html',
    styleUrls: ['./confirm-copy.component.scss']
})
export class ConfirmCopyComponent implements OnDestroy {

    copy$: Observable<MetadataResolver>;
    values$: Observable<MetadataResolver>;
    saving$: Observable<boolean>;
    summary$: Observable<MetadataConfiguration> = this.store.select(getResolverConfiguration);

    resolver: MetadataResolver;

    constructor(
        private store: Store<State>,
        private valueEmitter: ProviderValueEmitter,
        @Inject(METADATA_SOURCE_WIZARD) private sourceWizard: Wizard<MetadataResolver>
    ) {
        this.copy$ = this.store.select(getCopy);
        this.saving$ = this.store.select(getSaving);

        this.values$ = this.copy$.pipe(take(1));
        this.valueEmitter.changeEmitted$.subscribe(changes => this.store.dispatch(new UpdateResolverCopy(changes)));

        this.copy$.subscribe(p => this.resolver = p);

        this.store
            .select(getCurrentWizardSchema)
            .pipe(
                skipWhile(s => !s)
            )
            .subscribe(s => {
                if (s) {
                    this.store.dispatch(new LoadSchemaRequest(s));
                }
            });

        this.store.dispatch(new SetDefinition(this.sourceWizard));
    }

    onSave(resolver: MetadataResolver): void {
        this.store.dispatch(new AddResolverRequest(resolver));
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ClearWizard());
    }
}
