import { Component, Output, Input, EventEmitter, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, AbstractControl, Validators } from '@angular/forms';

import { ProviderFormFragmentComponent } from './provider-form-fragment.component';

import { ProviderStatusEmitter, ProviderValueEmitter } from '../../../domain/service/provider-change-emitter.service';
import { SsoService, MetadataResolver } from '../../../domain/model/';

@Component({
    selector: 'assertion-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './assertion-form.component.html'
})
export class AssertionFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() resolver: MetadataResolver;

    form: FormGroup;

    bindingTypes: string[] = [
        'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
        'urn:oasis:names:tc:SAML:1.0:profiles:browser-post'
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
            assertionConsumerServices: this.fb.array([])
        });
    }

    get assertionConsumerServices(): FormArray {
        return this.form.get('assertionConsumerServices') as FormArray;
    }

    setEndpoints(endpoints: SsoService[] = []): void {
        let fgs = endpoints.map(ep => this.fb.group(ep)),
            list = this.fb.array(fgs);
        this.form.setControl('assertionConsumerServices', list);
    }

    addEndpoint(): void {
        this.assertionConsumerServices.push(this.fb.group({
            binding: null,
            locationUrl: [''],
            makeDefault: false
        }));
    }

    removeEndpoint(index: number): void {
        this.assertionConsumerServices.removeAt(index);
    }

    markAsDefault(endpoint: AbstractControl): void {
        this.assertionConsumerServices.controls.forEach(element => {
            element.patchValue({
                makeDefault: (endpoint === element) ? !endpoint.get('makeDefault').value : false
            });
        });
        this.assertionConsumerServices.updateValueAndValidity();
    }

    ngOnChanges(): void {
        this.resolver.assertionConsumerServices = this.resolver.assertionConsumerServices || [];
        this.setEndpoints(this.resolver.assertionConsumerServices);
    }
} /* istanbul ignore next */
