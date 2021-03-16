import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import {  map, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromWizard from '../../../wizard/reducer';
import * as fromProvider from '../reducer';
import { SetIndex, LoadSchemaRequest } from '../../../wizard/action/wizard.action';
import { ClearEditor } from '../action/editor.action';
import { MetadataProvider } from '../../domain/model';
import { ClearProvider } from '../action/entity.action';
import { Wizard } from '../../../wizard/model';
import { UpdateProviderRequest } from '../action/collection.action';
import { NgbModal } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { UnsavedEntityComponent } from '../../domain/component/unsaved-entity.dialog';
import { CanComponentDeactivate } from '../../../core/service/can-deactivate.guard';
import { DifferentialService } from '../../../core/service/differential.service';
import { NAV_FORMATS } from '../../domain/component/editor-nav.component';
import { FilterableProviders } from '../model';

@Component({
    selector: 'provider-edit',
    templateUrl: './provider-edit.component.html',
    styleUrls: []
})

export class ProviderEditComponent implements OnDestroy, CanComponentDeactivate {
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    provider$: Observable<MetadataProvider>;
    definition$: Observable<Wizard<MetadataProvider>>;
    index$: Observable<string>;

    valid$: Observable<boolean>;
    isInvalid$: Observable<boolean>;
    status$: Observable<any>;
    isSaving$: Observable<boolean>;
    canFilter$: Observable<boolean>;

    latest: MetadataProvider;
    provider: MetadataProvider;

    formats = NAV_FORMATS;

    latest$: Observable<MetadataProvider>;

    constructor(
        private store: Store<fromProvider.ProviderState>,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private diffService: DifferentialService
    ) {
        this.provider$ = this.store.select(fromProvider.getSelectedProvider).pipe(filter(d => !!d));
        this.definition$ = this.store.select(fromWizard.getWizardDefinition).pipe(filter(d => !!d));
        this.index$ = this.store.select(fromWizard.getWizardIndex).pipe(filter(i => !!i));
        this.valid$ = this.store.select(fromProvider.getEditorIsValid);
        this.isInvalid$ = this.valid$.pipe(map(v => !v));
        this.status$ = this.store.select(fromProvider.getInvalidEditorForms);
        this.isSaving$ = this.store.select(fromProvider.getEntityIsSaving);

        let startIndex$ = this.route.firstChild.params.pipe(map(p => p.form || 'filters'));
        startIndex$.subscribe(index => this.store.dispatch(new SetIndex(index)));

        this.store
            .select(fromWizard.getCurrentWizardSchema)
            .pipe(filter(s => !!s))
            .subscribe(s => {
                if (s) {
                    this.store.dispatch(new LoadSchemaRequest(s));
                }
            });

        this.provider$.subscribe(p => this.provider = p);
        this.latest$ = this.store.select(fromProvider.getEntityChanges);
        this.latest$.subscribe(changes => this.latest = changes);

        this.canFilter$ = this.definition$.pipe(map(def => FilterableProviders.indexOf(def.type) > -1));
    }

    ngOnDestroy() {
        this.clear();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    clear(): void {
        this.store.dispatch(new ClearProvider());
        this.store.dispatch(new ClearEditor());
    }

    save(): void {
        this.store.dispatch(new UpdateProviderRequest(this.latest));
    }

    cancel(id): void {
        this.clear();
        this.router.navigate(['/', 'metadata', 'provider', id, 'configuration', 'options']);
    }

    canDeactivate(
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean> {
        if (nextState.url.match('edit')) {
            return of(true);
        }
        const diff = this.diffService.updatedDiff(this.provider, this.latest);
        if (diff && Object.keys(diff).length > 0) {
            let modal = this.modalService.open(UnsavedEntityComponent);
            modal.result.then(
                () => {
                    this.clear();
                    this.router.navigate([nextState.url]);
                },
                () => console.warn('denied')
            );
            return this.store.select(fromProvider.getEntityIsSaved);
        }
        return of(true);
    }
}

