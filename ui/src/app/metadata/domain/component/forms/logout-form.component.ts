import { Component, Input, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { ProviderFormFragmentComponent } from './provider-form-fragment.component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../../domain/service/provider-change-emitter.service';
import { MetadataResolver, LogoutEndpoint } from '../../../domain/model';

@Component({
    selector: 'logout-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './logout-form.component.html'
})
export class LogoutFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() resolver: MetadataResolver;

    form: FormGroup;

    bindingTypes: string[] = [
        'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
        'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect'
    ];

    constructor(
        protected fb: FormBuilder,
        protected statusEmitter: ProviderStatusEmitter,
        protected valueEmitter: ProviderValueEmitter
    ) {
        super(fb, statusEmitter, valueEmitter);
    }

    createForm(): void {
        this.form = this.fb.group({
            logoutEndpoints: this.fb.array([])
        });
    }

    createGroup(ep: LogoutEndpoint = { url: '', bindingType: null }): FormGroup {
        return this.fb.group({
            url: [ep.url || '', Validators.required],
            bindingType: [ep.bindingType || null, Validators.required]
        });
    }

    get logoutEndpoints(): FormArray {
        return this.form.get('logoutEndpoints') as FormArray;
    }

    setEndpoints(endpoints: LogoutEndpoint[] = []): void {
        let fgs = endpoints.map(ep => this.createGroup(ep)),
        list = this.fb.array(fgs);
        this.form.setControl('logoutEndpoints', list);
    }

    addEndpoint(): void {
        this.logoutEndpoints.push(this.createGroup());
    }

    removeEndpoint(index: number): void {
        this.logoutEndpoints.removeAt(index);
    }

    ngOnChanges(): void {
        this.resolver.logoutEndpoints = this.resolver.logoutEndpoints || [];
        this.setEndpoints(this.resolver.logoutEndpoints);
    }
} /* istanbul ignore next */
