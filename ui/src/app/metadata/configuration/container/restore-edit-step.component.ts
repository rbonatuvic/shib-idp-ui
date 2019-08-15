import { Component } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
    ConfigurationState,
    getFormattedModel,
    getRestorationChanges
} from '../reducer';
import { getWizardDefinition, getSchema, getValidators } from '../../../wizard/reducer';
import { Wizard } from '../../../wizard/model';
import { Metadata } from '../../domain/domain.type';
import { map, switchMap } from 'rxjs/operators';
import { NAV_FORMATS } from '../../domain/component/editor-nav.component';
import { UpdateRestorationChangesRequest } from '../action/restore.action';

@Component({
    selector: 'restore-edit-step',
    templateUrl: './restore-edit-step.component.html',
    styleUrls: []
})

export class RestoreEditStepComponent {

    definition$: Observable<Wizard<Metadata>> = this.store.select(getWizardDefinition);
    schema$: Observable<any> = this.store.select(getSchema);
    model$: Observable<Metadata> = this.store.select(getFormattedModel);

    validators$: Observable<any>;

    formats = NAV_FORMATS;

    constructor(
        private store: Store<ConfigurationState>,
        private route: ActivatedRoute
    ) {
        this.validators$ = this.definition$.pipe(
            map(def => def.validatorParams),
            switchMap(params => combineLatest(params.map(p => this.store.select(p)))),
            switchMap(selections => this.store.select(getValidators(selections)))
        );

        this.store.select(getRestorationChanges).subscribe(console.log);
    }

    onChange(changes: any): void {
        this.store.dispatch(new UpdateRestorationChangesRequest(changes));
    }
}

/*
this.valueChangeEmitted$.pipe(
            map(changes => changes.value),
            withLatestFrom(this.definition$, this.store.select(fromProvider.getSelectedProvider)),
            filter(([changes, definition, provider]) => definition && changes && provider),
            map(([changes, definition, provider]) => {
                const parsed = definition.parser(changes);
                return ({
                    ...parsed,
                    metadataFilters: [
                        ...provider.metadataFilters,
                        ...(parsed.metadataFilters || [])
                    ]
                });
            })
        )
            .subscribe(changes => this.store.dispatch(new UpdateProvider(changes)));
*/
