import {
    Component,
    OnDestroy,
    Inject
} from '@angular/core';
import {
    ActivatedRoute,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { skipWhile, startWith, distinctUntilChanged, map, defaultIfEmpty } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MetadataResolver } from '../../domain/model/metadata-resolver';
import * as fromCollections from '../reducer';
import { AddResolverRequest } from '../action/collection.action';
import * as fromResolver from '../reducer';

import { CanComponentDeactivate } from '../../../core/service/can-deactivate.guard';
import { METADATA_SOURCE_WIZARD } from '../wizard-definition';
import { Wizard, WizardStep } from '../../../wizard/model';
import { SetDefinition, SetIndex, SetDisabled, ClearWizard } from '../../../wizard/action/wizard.action';

import * as fromWizard from '../../../wizard/reducer';
import { LoadSchemaRequest } from '../../../wizard/action/wizard.action';

@Component({
    selector: 'resolver-wizard-page',
    templateUrl: './resolver-wizard.component.html',
    styleUrls: ['./resolver-wizard.component.scss']
})
export class ResolverWizardComponent implements OnDestroy, CanComponentDeactivate {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    nextStep: WizardStep;
    previousStep: WizardStep;
    currentPage: string;

    resolver$: Observable<MetadataResolver>;
    resolver: MetadataResolver;
    providerName$: Observable<string>;
    changes$: Observable<MetadataResolver>;
    changes: MetadataResolver;
    latest: MetadataResolver;

    wizardIndex$: Observable<number>;
    wizardIndex: number;
    currentPage$: Observable<any>;
    wizard$: Observable<any[]>;
    saved$: Observable<boolean>;
    saving: boolean;

    valid$: Observable<boolean>;
    schema$: Observable<any>;

    constructor(
        private store: Store<fromCollections.State>,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        @Inject(METADATA_SOURCE_WIZARD) private sourceWizard: Wizard<MetadataResolver>
    ) {
        this.store
            .select(fromWizard.getCurrentWizardSchema)
            .pipe(
                skipWhile(s => !s)
            )
            .subscribe(s => {
                if (s) {
                    this.store.dispatch(new LoadSchemaRequest(s));
                }
            });

        this.valid$ = this.store.select(fromResolver.getEntityIsValid);

        this.valid$
            .pipe(startWith(false))
            .subscribe((valid) => {
                this.store.dispatch(new SetDisabled(!valid));
            });

        this.store.dispatch(new SetDefinition(this.sourceWizard));

        this.store.select(fromWizard.getNext).subscribe(n => this.nextStep = n);
        this.store.select(fromWizard.getPrevious).subscribe(p => this.previousStep = p);
        this.store.select(fromWizard.getWizardIndex).subscribe(i => this.currentPage = i);

        this.changes$ = this.store.select(fromResolver.getEntityChanges);
        this.schema$ = this.store.select(fromWizard.getSchema);

        this.route.params
            .pipe(
                map(params => params.index),
                distinctUntilChanged()
            )
            .subscribe(index => {
                this.store.dispatch(new SetIndex(index));
            });
    }

    next(): void {
        this.go(this.nextStep.id);
    }

    previous(): void {
        this.go(this.previousStep.id);
    }

    save(): void {
        this.store.dispatch(new SetDisabled(true));
        this.store.dispatch(new AddResolverRequest(this.resolver));
    }

    go(index: string): void {
        this.router.navigate(
            [
                '../',
                index
            ],
            {
                relativeTo: this.route,
                queryParamsHandling: 'preserve'
            }
        );
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.store.dispatch(new ClearWizard());
    }

    canDeactivate(
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean> {
        return of(true);
        /*
        if (nextState.url.match('wizard')) { return of(true); }
        if (Object.keys(this.changes).length > 0) {
            let modal = this.modalService.open(UnsavedDialogComponent);
            modal.componentInstance.action = new UpdateChanges(this.latest);
            modal.result.then(
                () => this.router.navigate([nextState.url]),
                () => console.warn('denied')
            );
        }
        return this.store.select(fromResolver.getEntityIsSaved);
        */
    }
}
