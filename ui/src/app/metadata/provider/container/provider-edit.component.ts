import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { skipWhile, map, combineLatest } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromWizard from '../../../wizard/reducer';
import * as fromProvider from '../reducer';
import { ClearWizard, SetDefinition, SetIndex } from '../../../wizard/action/wizard.action';
import { ClearEditor, LoadSchemaRequest } from '../action/editor.action';
import { MetadataProvider } from '../../domain/model';
import { ClearProvider } from '../action/entity.action';
import { Wizard } from '../../../wizard/model';
import { UpdateProviderRequest } from '../action/collection.action';
import { NAV_FORMATS } from '../component/provider-editor-nav.component';

@Component({
    selector: 'provider-edit',
    templateUrl: './provider-edit.component.html',
    styleUrls: []
})

export class ProviderEditComponent implements OnDestroy {

    provider$: Observable<MetadataProvider>;
    definition$: Observable<Wizard<MetadataProvider>>;
    index$: Observable<string>;

    valid$: Observable<boolean>;
    isInvalid$: Observable<boolean>;
    status$: Observable<any>;

    latest: MetadataProvider;

    formats = NAV_FORMATS;

    constructor(
        private store: Store<fromProvider.ProviderState>,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.provider$ = this.store.select(fromProvider.getSelectedProvider).pipe(skipWhile(d => !d));
        this.definition$ = this.store.select(fromWizard.getWizardDefinition).pipe(skipWhile(d => !d));
        this.index$ = this.store.select(fromWizard.getWizardIndex).pipe(skipWhile(i => !i));
        this.valid$ = this.store.select(fromProvider.getEditorIsValid);
        this.isInvalid$ = this.valid$.pipe(map(v => !v));
        this.status$ = this.store.select(fromProvider.getInvalidEditorForms);

        let startIndex$ = this.route.firstChild ?
            this.route.firstChild.params.pipe(map(p => p.form || 'filters')) :
            this.definition$.pipe(map(d => d.steps[0].id));

        startIndex$
            .subscribe(index => {
                this.store.dispatch(new SetIndex(index));
            });

        this.index$.subscribe(id => this.go(id));

        this.store
            .select(fromWizard.getCurrentWizardSchema)
            .pipe(skipWhile(s => !s))
            .subscribe(s => {
                if (s) {
                    this.store.dispatch(new LoadSchemaRequest(s));
                }
            });

        this.store.select(fromProvider.getEntityChanges).subscribe(changes => this.latest = changes);
    }

    go(id: string): void {
        this.router.navigate(['./', id], { relativeTo: this.route });
    }

    setIndex(id: string): void {
        this.store.dispatch(new SetIndex(id));
    }

    ngOnDestroy() {
        this.store.dispatch(new ClearProvider());
        this.store.dispatch(new ClearWizard());
        this.store.dispatch(new ClearEditor());
    }

    save(): void {
        this.store.dispatch(new UpdateProviderRequest(this.latest));
    }

    cancel(): void {
        this.router.navigate(['metadata', 'manager', 'providers']);
    }
}

