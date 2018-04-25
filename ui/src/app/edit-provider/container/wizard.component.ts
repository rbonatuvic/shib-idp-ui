import {
    Component,
    ViewChild,
    AfterViewInit,
    OnInit,
    OnDestroy,
    EventEmitter
} from '@angular/core';
import {
    ActivatedRoute,
    Router,
    CanDeactivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/takeLast';
import 'rxjs/add/operator/skipWhile';

import { MetadataProvider } from '../../domain/model/metadata-provider';
import * as fromCollections from '../../domain/reducer';
import * as draftActions from '../../domain/action/draft-collection.action';
import { AddProviderRequest, RemoveProviderRequest } from '../../domain/action/provider-collection.action';
import * as fromEditor from '../reducer';

import { ProviderStatusEmitter, ProviderValueEmitter } from '../../domain/service/provider-change-emitter.service';
import { UpdateStatus, UpdateChanges, SaveChanges } from '../action/editor.action';
import { WIZARD as WizardDef, EditorFlowDefinition } from '../editor-definition.const';
import { CanComponentDeactivate } from '../../core/service/can-deactivate.guard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { UnsavedDialogComponent } from '../component/unsaved-dialog.component';

@Component({
    selector: 'wizard-page',
    templateUrl: './wizard.component.html',
    styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit, OnDestroy, CanComponentDeactivate {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    provider$: Observable<MetadataProvider>;
    provider: MetadataProvider;
    providerName$: Observable<string>;
    changes$: Observable<MetadataProvider>;
    changes: MetadataProvider;
    latest: MetadataProvider;

    wizardIndex$: Observable<number>;
    currentPage$: Observable<any>;
    wizard$: Observable<any[]>;
    wizard: EditorFlowDefinition[];
    saved$: Observable<boolean>;
    saving: boolean;

    constructor(
        private store: Store<fromCollections.State>,
        private route: ActivatedRoute,
        private router: Router,
        private statusEmitter: ProviderStatusEmitter,
        private valueEmitter: ProviderValueEmitter,
        private modalService: NgbModal
    ) {
        this.provider$ = this.store.select(fromCollections.getSelectedDraft);
        this.providerName$ = this.provider$.map(p => p.serviceProviderName);
        this.changes$ = this.store.select(fromEditor.getEditorChanges);

        this.wizardIndex$ = this.route.params.map(params => Number(params.index));
        this.currentPage$ = this.wizardIndex$.map(index => WizardDef.find(r => r.index === index));
        this.wizard = WizardDef;

        this.saved$ = this.store.select(fromEditor.getEditorIsSaved);

        this.store.select(fromEditor.getEditorIsSaving).takeUntil(this.ngUnsubscribe).subscribe(saving => this.saving = saving);
    }

    save(): void {
        this.store.dispatch(new AddProviderRequest(this.latest));
    }

    next(index: number): void {
        this.go(index);
    }

    previous(index: number): void {
        this.go(index);
    }

    go(index: number): void {
        this.store.dispatch(new draftActions.UpdateDraftRequest(this.latest));
        this.router.navigate(['../', index], { relativeTo: this.route });
    }

    ngOnInit(): void {
        this.subscribe();
    }

    subscribe(): void {
        this.provider$
            .takeUntil(this.ngUnsubscribe)
            .skipWhile(() => this.saving)
            .subscribe(provider => this.provider = provider);
        this.changes$
            .takeUntil(this.ngUnsubscribe)
            .skipWhile(() => this.saving)
            .subscribe(changes => this.changes = changes);
        this.changes$
            .takeUntil(this.ngUnsubscribe)
            .skipWhile(() => this.saving)
            .combineLatest(this.provider$, (changes, base) => ({ ...base, ...changes }))
            .subscribe(latest => this.latest = latest);

        this.valueEmitter
            .changeEmitted$
            .takeUntil(this.ngUnsubscribe)
            .skipWhile(() => this.saving)
            .subscribe(changes => {
                this.store.dispatch(new UpdateChanges(changes));
            });
        this.statusEmitter
            .changeEmitted$
            .takeUntil(this.ngUnsubscribe)
            .skipWhile(() => this.saving)
            .combineLatest(this.currentPage$, (status: string, page: any) => {
                return { [page.path]: status };
            })
            .subscribe(status => {
                this.store.dispatch(new UpdateStatus(status));
            });
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
        if (nextState.url.match('wizard')) { return Observable.of(true); }
        if (Object.keys(this.changes).length > 0) {
            let modal = this.modalService.open(UnsavedDialogComponent);
            modal.componentInstance.action = new SaveChanges(this.latest);
            modal.result.then(
                () => this.router.navigate([nextState.url]),
                () => console.warn('denied')
            );
        }
        return this.store.select(fromEditor.getEditorIsSaved);
    }
} /* istanbul ignore next */
