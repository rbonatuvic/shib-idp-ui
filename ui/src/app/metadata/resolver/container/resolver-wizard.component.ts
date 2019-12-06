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
import { skipWhile, startWith, distinctUntilChanged, map, takeUntil, combineLatest, withLatestFrom } from 'rxjs/operators';
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
import { UnsavedEntityComponent } from '../../domain/component/unsaved-entity.dialog';
import { Clear } from '../action/entity.action';
import { MetadataConfiguration } from '../../configuration/model/metadata-configuration';

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

    summary$: Observable<MetadataConfiguration> = this.store.select(fromCollections.getResolverConfiguration);

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

        this.resolver$ = this.store.select(fromCollections.getSelectedDraft);

        this.changes$.pipe(
            takeUntil(this.ngUnsubscribe),
            skipWhile(() => this.saving),
            combineLatest(this.resolver$, (changes, base) => ({ ...base, ...changes }))
        ).subscribe(latest => this.latest = latest);

        this.changes$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(c => this.changes = c);
        this.resolver$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(r => this.resolver = r);
    }

    next(): void {
        this.go(this.nextStep.id);
    }

    previous(): void {
        this.go(this.previousStep.id);
    }

    save(): void {
        this.store.dispatch(new SetDisabled(true));
        this.store.dispatch(new AddResolverRequest(this.latest));
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

    gotoPage(page: string): void {
        this.store.dispatch(new SetIndex(page));
    }

    get blacklist(): string[] {
        return ['id', 'resourceId', 'entityId', 'serviceProviderName'];
    }

    hasChanges(changes: MetadataResolver): boolean {
        return Object.keys(changes).filter(key => !(this.blacklist.indexOf(key) > -1)).length > 0;
    }

    isNew(changes: MetadataResolver): boolean {
        return Object.keys(changes).filter(key => !(this.blacklist.indexOf(key) > -1)).length === 0;
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
        const changingIds = currentState.root.queryParams.id !== nextState.root.queryParams.id;
        if (nextState.url.match('blank') && !!nextState.root.queryParams.id && !changingIds) {
            return of(true);
        }
        if (this.hasChanges(this.changes)) {
            let modal = this.modalService.open(UnsavedEntityComponent);
            modal.componentInstance.message = 'resolver';
            modal.result.then(
                () => {
                    this.store.dispatch(new Clear());
                    this.router.navigateByUrl(nextState.url);
                },
                () => console.warn('denied')
            );
        }
        if (this.isNew(this.latest)) {
            return of(true);
        }
        return this.store.select(fromResolver.getEntityIsSaved);
    }
}
