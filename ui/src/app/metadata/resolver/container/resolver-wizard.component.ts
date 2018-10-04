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
import { skipWhile } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MetadataResolver } from '../../domain/model/metadata-resolver';
import * as fromCollections from '../reducer';
import * as draftActions from '../action/draft.action';
import { AddResolverRequest } from '../action/collection.action';
import * as fromResolver from '../reducer';

import { UpdateChanges } from '../action/entity.action';
import { CanComponentDeactivate } from '../../../core/service/can-deactivate.guard';

import { UnsavedDialogComponent } from '../component/unsaved-dialog.component';
import { METADATA_SOURCE_WIZARD } from '../wizard-definition';
import { Wizard } from '../../../wizard/model';
import { SetDefinition, SetIndex } from '../../../wizard/action/wizard.action';

import * as fromWizard from '../../../wizard/reducer';
import { LoadSchemaRequest } from '../../../wizard/action/wizard.action';

@Component({
    selector: 'resolver-wizard-page',
    templateUrl: './resolver-wizard.component.html',
    styleUrls: ['./resolver-wizard.component.scss']
})
export class ResolverWizardComponent implements OnDestroy, CanComponentDeactivate {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

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

        this.store.dispatch(new SetDefinition(this.sourceWizard));
        this.store.dispatch(new SetIndex(this.sourceWizard.steps[0].id));

        this.store.select(fromWizard.getParsedSchema).subscribe(s => console.log(s));
    }

    save(): void {
        this.store.dispatch(new AddResolverRequest(this.latest));
    }

    next(index: number): void {
        this.go(index.toString());
    }

    previous(index: number): void {
        this.go(index.toString());
    }

    go(index: string): void {
        this.store.dispatch(new SetIndex(index));
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    canDeactivate(
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean> {
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
    }
} /* istanbul ignore next */
