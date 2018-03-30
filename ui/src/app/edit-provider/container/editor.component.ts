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
import { FormBuilder, FormGroup, FormControl, Validators, NgModel } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';

import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/distinctUntilChanged';

import { MetadataProvider } from '../../domain/model/metadata-provider';
import * as fromProviders from '../../metadata-provider/reducer';
import { UpdateProviderRequest } from '../../metadata-provider/action/provider.action';
import * as fromEditor from '../reducer';

import { ProviderStatusEmitter, ProviderValueEmitter } from '../../domain/service/provider-change-emitter.service';
import { UpdateStatus, UpdateChanges, CancelChanges } from '../action/editor.action';
import { EDITOR as EditorDef, EditorFlowDefinition } from '../editor-definition.const';
import { UnsavedDialogComponent } from '../component/unsaved-dialog.component';

@Component({
    selector: 'editor-page',
    templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    unsavedMessage = `You haven't saved your changes!`;
    modified = false;
    open = false;

    changes$: Observable<MetadataProvider>;
    changes: MetadataProvider;
    updates: MetadataProvider;
    latest: MetadataProvider;
    latest$: Observable<MetadataProvider>;

    provider$: Observable<MetadataProvider>;
    providerName$: Observable<string>;
    provider: MetadataProvider;
    editorIndex$: Observable<number>;
    editor$: Observable<any[]>;
    editor: EditorFlowDefinition[];
    currentPage$: Observable<any>;
    invalidForms$: Observable<string[]>;
    invalidForms: string[];
    otherPageInvalid$: Observable<boolean>;
    saving: boolean;

    wizardIsValid$: Observable<boolean>;
    wizardIsInvalid$: Observable<boolean>;

    constructor(
        private store: Store<fromProviders.State>,
        private route: ActivatedRoute,
        private router: Router,
        private statusEmitter: ProviderStatusEmitter,
        private valueEmitter: ProviderValueEmitter,
        private modalService: NgbModal
    ) {
        this.provider$ = this.store.select(fromProviders.getSelectedProvider);
        this.changes$ = this.store.select(fromEditor.getEditorChanges);

        this.latest$ = this.provider$
            .combineLatest(this.changes$, (base, changes) => Object.assign({}, base, changes));

        this.providerName$ = this.provider$.map(p => p.serviceProviderName);
        this.changes$ = this.store.select(fromEditor.getEditorChanges);
        this.editorIndex$ = this.route.params.map(params => Number(params.index));
        this.currentPage$ = this.editorIndex$.map(index => EditorDef.find(r => r.index === index));
        this.editor = EditorDef;
        this.store.select(fromEditor.getEditorIsSaving).takeUntil(this.ngUnsubscribe).subscribe(saving => this.saving = saving);

        this.wizardIsValid$ = this.store.select(fromEditor.getEditorIsValid);
        this.wizardIsInvalid$ = this.wizardIsValid$.map(valid => !valid);
    }

    save(): void {
        this.store.dispatch(new UpdateProviderRequest({
            ...this.latest,
            ...this.changes,
            ...this.updates
        }));
    }

    cancel(): void {
        this.store.dispatch(new CancelChanges());
    }

    go(event, index: number): void {
        event.stopPropagation();
        event.preventDefault();
        this.store.dispatch(new UpdateChanges(this.updates));
        this.router.navigate(['../', index], { relativeTo: this.route });
        this.open = false;
    }

    ngOnInit(): void {
        this.provider$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(provider => this.provider = provider);
        this.changes$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(changes => this.changes = changes);

        this.valueEmitter
            .changeEmitted$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(updates => {
                this.updates = updates;
            });

        this.statusEmitter
            .changeEmitted$
            .debounceTime(1)
            .takeUntil(this.ngUnsubscribe)
            .withLatestFrom(this.currentPage$, (status: string, page: any) => {
                return { [page.path]: status };
            })
            .subscribe(status => {
                this.store.dispatch(new UpdateStatus(status));
            });

        this.latest$
            .takeUntil(this.ngUnsubscribe)
            .skipWhile(() => this.saving)
            .subscribe(latest => this.latest = latest);

        this.invalidForms$ = this.store.select(fromEditor.getInvalidEditorForms);

        this.invalidForms$
            .distinctUntilChanged()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(forms => {
                this.invalidForms = forms;
            });

        this.otherPageInvalid$ = this.invalidForms$
            .distinctUntilChanged()
            .withLatestFrom(this.currentPage$, (invalid, current) => invalid.filter(key => key !== current.path))
            .map(otherInvalid => !!otherInvalid.length);
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
        if (nextState.url.match('edit')) { return Observable.of(true); }
        if (Object.keys({ ...this.changes }).length > 0) {
            let modal = this.modalService.open(UnsavedDialogComponent);
            modal.componentInstance.provider = this.latest;
            modal.componentInstance.message = 'editor';
            modal.componentInstance.action = new CancelChanges();
            modal.result.then(
                () => this.router.navigate([nextState.url]),
                () => console.warn('denied')
            );
        }
        return this.store.select(fromEditor.getEditorIsSaved);
    }
}
