import { Component, Input, Output, OnInit, OnDestroy, AfterViewInit,
    ChangeDetectionStrategy, EventEmitter, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, FormControlName, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/startWith';

import { ProviderStatusEmitter, ProviderValueEmitter } from '../../service/provider-change-emitter.service';
import { MetadataProvider, Organization, Contact } from '../../../domain/model/metadata-provider';
import * as fromProviders from '../../reducer';

import * as constants from '../../../shared/constant';

@Component({
    selector: 'provider-form-fragment',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `Foo`
})
export class ProviderFormFragmentComponent implements OnInit, OnDestroy {
    @Input() provider: MetadataProvider;
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    protected ngUnsubscribe: Subject<void> = new Subject<void>();
    protected valueEmitSubscription: Subscription;
    protected statusEmitSubscription: Subscription;

    form: FormGroup;
    provider$: Observable<MetadataProvider>;

    defaultMaxLength = constants.DEFAULT_FIELD_MAX_LENGTH;

    constructor(
        protected fb: FormBuilder,
        protected statusEmitter: ProviderStatusEmitter,
        protected valueEmitter: ProviderValueEmitter
    ) {
        this.createForm();
    }

    createForm(): void {
        this.form = this.fb.group({});
    }

    ngOnInit(): void {
        this.valueEmitSubscription = this.form
            .valueChanges
            .takeUntil(this.ngUnsubscribe)
            .startWith(this.form.value)
            .subscribe(changes => this.valueEmitter.emit(changes));

        this.statusEmitSubscription = this.form
            .statusChanges
            .takeUntil(this.ngUnsubscribe)
            .startWith(this.form.status)
            .subscribe(status => this.statusEmitter.emit(status));
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
} /* istanbul ignore next */
