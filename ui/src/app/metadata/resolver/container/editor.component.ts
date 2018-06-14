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
import { Observable, Subject, of } from 'rxjs';
import { combineLatest, map, takeUntil, withLatestFrom, debounceTime, skipWhile, distinctUntilChanged } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';

import { MetadataResolver } from '../../domain/model/metadata-provider';
import * as fromProviders from '../../domain/reducer';
import { UpdateProviderRequest } from '../../domain/action/provider-collection.action';
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

    changes$: Observable<MetadataResolver>;
    changes: MetadataResolver;
    updates: MetadataResolver;
    latest: MetadataResolver;
    latest$: Observable<MetadataResolver>;

    provider$: Observable<MetadataResolver>;
    providerName$: Observable<string>;
    provider: MetadataResolver;
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

        this.latest$ = this.provider$.pipe(
            combineLatest(this.changes$, (base, changes) => Object.assign({}, base, changes))
        );

        this.providerName$ = this.provider$.pipe(map(p => p.serviceProviderName));
        this.changes$ = this.store.select(fromEditor.getEditorChanges);
        this.editorIndex$ = this.route.params.pipe(map(params => Number(params.index)));
        this.currentPage$ = this.editorIndex$.pipe(map(index => EditorDef.find(r => r.index === index)));
        this.editor = EditorDef;
        this.store.select(fromEditor.getEditorIsSaving).pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(saving => this.saving = saving);

        this.wizardIsValid$ = this.store.select(fromEditor.getEditorIsValid);
        this.wizardIsInvalid$ = this.wizardIsValid$.pipe(map(valid => !valid));
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
        this.provider$.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(provider => this.provider = provider);
        this.changes$.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(changes => this.changes = changes);

        this.valueEmitter
            .changeEmitted$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(updates => this.updates = updates);

        this.statusEmitter
            .changeEmitted$
            .pipe(
                debounceTime(1),
                takeUntil(this.ngUnsubscribe),
                withLatestFrom(this.currentPage$, (status: string, page: any) => {
                    return { [page.path]: status };
                })
            )
            .subscribe(status => this.store.dispatch(new UpdateStatus(status)));

        this.latest$.pipe(
            takeUntil(this.ngUnsubscribe),
            skipWhile(() => this.saving)
        ).subscribe(latest => this.latest = latest);

        this.invalidForms$ = this.store.select(fromEditor.getInvalidEditorForms);

        this.invalidForms$.pipe(
            distinctUntilChanged(),
            takeUntil(this.ngUnsubscribe)
        ).subscribe(forms => this.invalidForms = forms);

        this.otherPageInvalid$ = this.invalidForms$.pipe(
            distinctUntilChanged(),
            withLatestFrom(this.currentPage$, (invalid, current) => invalid.filter(key => key !== current.path)),
            map(otherInvalid => !!otherInvalid.length)
        );
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
        if (nextState.url.match('edit')) { return of(true); }
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
