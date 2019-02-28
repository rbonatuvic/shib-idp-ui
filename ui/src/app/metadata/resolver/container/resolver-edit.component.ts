import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { skipWhile, map, combineLatest, filter, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromWizard from '../../../wizard/reducer';
import * as fromResolver from '../reducer';
import { ClearWizard, SetIndex, LoadSchemaRequest } from '../../../wizard/action/wizard.action';
import { MetadataResolver } from '../../domain/model';
import { Clear } from '../action/entity.action';
import { Wizard } from '../../../wizard/model';
import { UpdateResolverRequest } from '../action/collection.action';
import { NgbModal } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { CanComponentDeactivate } from '../../../core/service/can-deactivate.guard';
import { DifferentialService } from '../../../core/service/differential.service';
import { NAV_FORMATS } from '../../domain/component/editor-nav.component';
import { UnsavedEntityComponent } from '../../domain/component/unsaved-entity.dialog';

@Component({
    selector: 'resolver-edit',
    templateUrl: './resolver-edit.component.html',
    styleUrls: []
})

export class ResolverEditComponent implements OnDestroy, CanComponentDeactivate {
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    resolver$: Observable<MetadataResolver>;
    definition$: Observable<Wizard<MetadataResolver>>;
    index$: Observable<string>;

    valid$: Observable<boolean>;
    isInvalid$: Observable<boolean>;
    status$: Observable<any>;
    isSaving$: Observable<boolean>;

    latest: MetadataResolver;
    resolver: MetadataResolver;

    formats = NAV_FORMATS;

    constructor(
        private store: Store<fromResolver.ResolverState>,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private diffService: DifferentialService
    ) {
        this.resolver$ = this.store.select(fromResolver.getSelectedResolver).pipe(filter(d => !!d));
        this.definition$ = this.store.select(fromWizard.getWizardDefinition).pipe(filter(d => !!d));
        this.index$ = this.store.select(fromWizard.getWizardIndex).pipe(filter(i => !!i));
        this.valid$ = this.store.select(fromResolver.getEntityIsValid);
        this.isInvalid$ = this.valid$.pipe(map(v => !v));
        this.status$ = this.store.select(fromResolver.getInvalidEntityForms);
        this.isSaving$ = this.store.select(fromResolver.getEntityIsSaving);

        let startIndex$ = this.route.firstChild.params.pipe(map(p => p.form));
        startIndex$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(index => this.store.dispatch(new SetIndex(index)));

        this.index$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(index => index && this.go(index));

        this.store
            .select(fromWizard.getCurrentWizardSchema)
            .pipe(filter(s => !!s))
            .subscribe(s => this.store.dispatch(new LoadSchemaRequest(s)));

        this.resolver$.subscribe(p => this.resolver = p);
        this.store.select(fromResolver.getEntityChanges).subscribe(changes => this.latest = changes);
    }

    go(index: string): void {
        this.router.navigate(['./', index], { relativeTo: this.route });
    }

    ngOnDestroy() {
        this.clear();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    clear(): void {
        this.store.dispatch(new Clear());
    }

    save(): void {
        this.store.dispatch(new UpdateResolverRequest(this.latest));
    }

    cancel(): void {
        this.clear();
        this.router.navigate(['dashboard', 'metadata', 'manager', 'resolvers']);
    }

    canDeactivate(
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean> {
        if (nextState.url.match('edit')) {
            return of(true);
        }
        const diff = this.diffService.updatedDiff(this.resolver, this.latest);
        if (diff && Object.keys(diff).length > 0) {
            let modal = this.modalService.open(UnsavedEntityComponent);
            modal.result.then(
                () => {
                    this.clear();
                    this.router.navigate([nextState.url]);
                },
                () => console.warn('denied')
            );
            return this.store.select(fromResolver.getEntityIsSaved);
        }
        return of(true);
    }
}

