import { Component, Output, Input, EventEmitter, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ProviderFormFragmentComponent } from './provider-form-fragment.component';

import { ProviderStatusEmitter, ProviderValueEmitter } from '../../service/provider-change-emitter.service';
import { MetadataProvider, LogoutEndpoint } from '../../model/metadata-provider';
import * as patterns from '../../../shared/regex';

@Component({
    selector: 'logout-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './logout-form.component.html'
})
export class LogoutFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() provider: MetadataProvider;

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

    get logoutEndpoints(): FormArray {
        return this.form.get('logoutEndpoints') as FormArray;
    }

    setEndpoints(endpoints: LogoutEndpoint[] = []): void {
        let fgs = endpoints.map(ep => this.fb.group(ep)),
            list = this.fb.array(fgs);
        this.form.setControl('logoutEndpoints', list);
    }

    addEndpoint(): void {
        this.logoutEndpoints.push(this.fb.group({
            url: ['', Validators.required],
            bindingType: [null, Validators.required]
        }));
    }

    removeEndpoint(index: number): void {
        this.logoutEndpoints.removeAt(index);
    }

    ngOnChanges(): void {
        this.provider.logoutEndpoints = this.provider.logoutEndpoints || [];
        this.setEndpoints(this.provider.logoutEndpoints);
    }
} /* istanbul ignore next */
