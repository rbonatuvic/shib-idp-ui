import { Component, Output, Input, EventEmitter, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ProviderFormFragmentComponent } from './provider-form-fragment.component';

import { ProviderStatusEmitter, ProviderValueEmitter } from '../../service/provider-change-emitter.service';
import { ListValuesService } from '../../service/list-values.service';
import { MetadataProvider, Organization, Contact } from '../../model/metadata-provider';

import { URL_REGEX } from '../../../shared/regex';

@Component({
    selector: 'relying-party-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './relying-party-form.component.html'
})
export class RelyingPartyFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() provider: MetadataProvider;

    form: FormGroup;
    nameIdFormatOptions = this.listValues.nameIdFormats;
    authenticationMethodOptions = this.listValues.authenticationMethods;

    constructor(
        protected fb: FormBuilder,
        protected statusEmitter: ProviderStatusEmitter,
        protected valueEmitter: ProviderValueEmitter,
        private listValues: ListValuesService
    ) {
        super(fb, statusEmitter, valueEmitter);
    }

    createForm(): void {
        this.form = this.fb.group({
            relyingPartyOverrides: this.fb.group({
                signAssertion: false,
                dontSignResponse: false,
                turnOffEncryption: false,
                useSha: false,
                ignoreAuthenticationMethod: false,
                omitNotBefore: false,
                responderId: '',
                nameIdFormats: this.fb.array([]),
                authenticationMethods: this.fb.array([])
            })
        });
    }

    getRequiredControl = (value: string): FormControl => this.fb.control(value, Validators.required);

    setNameIdFormats(nameIdFormats: string[] = []): void {
        let fcs = nameIdFormats.map(this.getRequiredControl),
            list = this.fb.array(fcs),
            group = this.form.get('relyingPartyOverrides') as FormGroup;
        group.setControl('nameIdFormats', list);
    }

    setAuthenticationMethods(methods: string[] = []): void {
        let fcs = methods.map(this.getRequiredControl),
            list = this.fb.array(fcs),
            group = this.form.get('relyingPartyOverrides') as FormGroup;
        group.setControl('authenticationMethods', list);
    }

    get nameIdFormats(): FormArray {
        return this.form.get('relyingPartyOverrides.nameIdFormats') as FormArray;
    }

    get authenticationMethods(): FormArray {
        return this.form.get('relyingPartyOverrides.authenticationMethods') as FormArray;
    }

    addFormat(text: string = ''): void {
        this.nameIdFormats.push(this.fb.control(text, Validators.required));
    }

    addAuthenticationMethod(text: string = ''): void {
        this.authenticationMethods.push(this.fb.control(text, Validators.required));
    }

    removeFormat(index: number): void {
        this.nameIdFormats.removeAt(index);
    }

    removeAuthenticationMethod(index: number): void {
        this.authenticationMethods.removeAt(index);
    }

    ngOnChanges(): void {
        let overrides = this.provider.relyingPartyOverrides || {nameIdFormats: [], authenticationMethods: []};
        this.form.reset({
            relyingPartyOverrides: overrides
        });
        this.setNameIdFormats(overrides.nameIdFormats);
        this.setAuthenticationMethods(overrides.authenticationMethods);
    }
} /* istanbul ignore next */
