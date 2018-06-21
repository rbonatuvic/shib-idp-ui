import { Component, Input, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { ProviderFormFragmentComponent } from './provider-form-fragment.component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../../domain/service/provider-change-emitter.service';
import { ListValuesService } from '../../../domain/service/list-values.service';
import { MetadataResolver } from '../../../domain/model';


@Component({
    selector: 'relying-party-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './relying-party-form.component.html'
})
export class RelyingPartyFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() resolver: MetadataResolver;

    form: FormGroup;
    nameIds$: Observable<string[]> = of([]);
    authenticationMethods$: Observable<string[]> = of([]);

    nameIdFormatList: FormArray;
    authenticationMethodList: FormArray;

    constructor(
        protected fb: FormBuilder,
        protected statusEmitter: ProviderStatusEmitter,
        protected valueEmitter: ProviderValueEmitter,
        private listValues: ListValuesService
    ) {
        super(fb, statusEmitter, valueEmitter);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    createForm(): void {
        this.nameIdFormatList = this.fb.array([]);
        this.authenticationMethodList = this.fb.array([]);
        this.form = this.fb.group({
            relyingPartyOverrides: this.fb.group({
                signAssertion: false,
                dontSignResponse: false,
                turnOffEncryption: false,
                useSha: false,
                ignoreAuthenticationMethod: false,
                omitNotBefore: false,
                responderId: '',
                nameIdFormats: this.nameIdFormatList,
                authenticationMethods: this.authenticationMethodList
            })
        });
    }

    getRequiredControl = (value: string): FormControl => this.fb.control(value, Validators.required);

    setNameIdFormats(nameIdFormats: string[] = []): void {
        let fcs = nameIdFormats.map(this.getRequiredControl);
        fcs.forEach(ctrl => this.nameIdFormatList.push(ctrl));
    }

    setAuthenticationMethods(methods: string[] = []): void {
        let fcs = methods.map(this.getRequiredControl);
        fcs.forEach(ctrl => this.authenticationMethodList.push(ctrl));
    }

    addFormat(text: string = ''): void {
        this.nameIdFormatList.push(this.getRequiredControl(text));
    }

    addAuthenticationMethod(text: string = ''): void {
        this.authenticationMethodList.push(this.getRequiredControl(text));
    }

    removeFormat(index: number): void {
        this.nameIdFormatList.removeAt(index);
    }

    removeAuthenticationMethod(index: number): void {
        this.authenticationMethodList.removeAt(index);
    }

    ngOnChanges(): void {
        let overrides = this.resolver.relyingPartyOverrides || {nameIdFormats: [], authenticationMethods: []};
        this.form.reset({
            relyingPartyOverrides: overrides
        });
        this.setNameIdFormats(overrides.nameIdFormats);
        this.setAuthenticationMethods(overrides.authenticationMethods);
    }

    searchNameIds(query: string): void {
        this.nameIds$ = this.listValues.searchFormats(of(query));
    }

    searchAuthMethods(query: string): void {
        this.authenticationMethods$ = this.listValues.searchAuthenticationMethods(of(query));
    }
} /* istanbul ignore next */
