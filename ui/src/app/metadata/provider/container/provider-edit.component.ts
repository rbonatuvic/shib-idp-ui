import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
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
import { NgbModal } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { UnsavedDialogComponent } from '../../resolver/component/unsaved-dialog.component';
import { UnsavedProviderComponent } from '../component/unsaved-provider.dialog';
import { CanComponentDeactivate } from '../../../core/service/can-deactivate.guard';
import { DifferentialService } from '../../../core/service/differential.service';

@Component({
    selector: 'provider-edit',
    templateUrl: './provider-edit.component.html',
    styleUrls: []
})

export class ProviderEditComponent implements OnDestroy, CanComponentDeactivate {

    provider$: Observable<MetadataProvider>;
    definition$: Observable<Wizard<MetadataProvider>>;
    index$: Observable<string>;

    valid$: Observable<boolean>;
    isInvalid$: Observable<boolean>;
    status$: Observable<any>;

    latest: MetadataProvider;
    provider: MetadataProvider;

    formats = NAV_FORMATS;

    constructor(
        private store: Store<fromProvider.ProviderState>,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private diffService: DifferentialService
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

        this.provider$.subscribe(p => this.provider = p);
        this.store.select(fromProvider.getEntityChanges).subscribe(changes => this.latest = changes);
    }

    go(id: string): void {
        this.router.navigate(['./', id], { relativeTo: this.route });
    }

    setIndex(id: string): void {
        this.store.dispatch(new SetIndex(id));
    }

    ngOnDestroy() {
        this.clear();
    }

    clear(): void {
        this.store.dispatch(new ClearProvider());
        this.store.dispatch(new ClearWizard());
        this.store.dispatch(new ClearEditor());
    }

    save(): void {
        this.store.dispatch(new UpdateProviderRequest(this.latest));
    }

    cancel(): void {
        this.clear();
        this.router.navigate(['metadata', 'manager', 'providers']);
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
            let modal = this.modalService.open(UnsavedProviderComponent);
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

