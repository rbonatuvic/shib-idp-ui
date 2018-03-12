import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import * as fromFilter from '../reducer';
import { ProviderFormFragmentComponent } from '../../metadata-provider/component/forms/provider-form-fragment.component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../metadata-provider/service/provider-change-emitter.service';
import { CancelCreateFilter } from '../action/collection.action';

@Component({
    selector: 'new-filter-page',
    templateUrl: './new-filter.component.html'
})
export class NewFilterComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {

    entityIds$: Observable<string[]>;

    constructor(
        private store: Store<fromFilter.State>,
        protected statusEmitter: ProviderStatusEmitter,
        protected valueEmitter: ProviderValueEmitter,
        protected fb: FormBuilder
    ) {
        super(fb, statusEmitter, valueEmitter);
    }

    createForm(): void {
        this.form = this.fb.group({
            entityId: ['', Validators.required],
            filterName: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.entityIds$ = Observable.of(['foo', 'bar', 'baz']);
    }

    ngOnChanges(): void {}

    ngOnDestroy(): void {}

    onViewMore($event): void {}

    save(): void {
        console.log('Save!');
    }

    cancel(): void {
        this.store.dispatch(new CancelCreateFilter(true));
    }
}
