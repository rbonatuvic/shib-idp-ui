import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormControlName } from '@angular/forms';

import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';

import { ProviderStatusEmitter, ProviderValueEmitter } from '../../domain/service/provider-change-emitter.service';
import { MetadataResolver } from '../../domain/model';

import * as constants from '../../../shared/constant';
import { removeNulls } from '../../../shared/util';

@Component({
    selector: 'provider-form-fragment',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `Foo`
})
export class ProviderFormFragmentComponent implements OnInit, OnDestroy {
    @Input() resolver: MetadataResolver;
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    protected ngUnsubscribe: Subject<void> = new Subject<void>();
    protected valueEmitSubscription: Subscription;
    protected statusEmitSubscription: Subscription;

    form: FormGroup;
    provider$: Observable<MetadataResolver>;

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
        this.valueEmitSubscription = this.form.valueChanges.pipe(
            takeUntil(this.ngUnsubscribe),
            startWith(this.form.value)
        ).subscribe(changes => this.valueEmitter.emit(removeNulls(changes, true)));

        this.statusEmitSubscription = this.form.statusChanges.pipe(
            takeUntil(this.ngUnsubscribe),
            startWith(this.form.status)
        ).subscribe(status => this.statusEmitter.emit(status));
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
} /* istanbul ignore next */