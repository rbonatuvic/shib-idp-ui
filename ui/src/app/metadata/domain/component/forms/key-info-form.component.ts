import { Component, Input, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { ProviderFormFragmentComponent } from './provider-form-fragment.component';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../../domain/service/provider-change-emitter.service';
import { MetadataResolver, Certificate } from '../../../domain/model';

@Component({
    selector: 'key-info-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './key-info-form.component.html'
})
export class KeyInfoFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() resolver: MetadataResolver;

    hasCert$: Observable<boolean>;

    form: FormGroup;

    types: string[] = [
        'signing',
        'encryption',
        'both'
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
            securityInfo: this.fb.group({
                x509CertificateAvailable: [false],
                authenticationRequestsSigned: [false],
                wantAssertionsSigned: [false],
                x509Certificates: this.fb.array([])
            })
        });
    }

    get x509Certificates(): FormArray {
        return this.form.get('securityInfo.x509Certificates') as FormArray;
    }

    createGroup(values: Certificate = {name: '', type: 'both', value: ''}): FormGroup {
        return this.fb.group({
            name: [values.name || '', Validators.required],
            type: [values.type || 'both', Validators.required],
            value: [values.value || '', Validators.required]
        });
    }

    setCertificates(certs: Certificate[] = []): void {
        let fgs = certs.map(ep => this.createGroup(ep)),
            list = this.fb.array(fgs, Validators.minLength(1)),
            group = this.form.get('securityInfo') as FormGroup;
        group.setControl('x509Certificates', list);
    }

    addCert(): void {
        this.x509Certificates.push(this.createGroup());
    }

    removeCert(index: number): void {
        this.x509Certificates.removeAt(index);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.hasCert$ = this.form.valueChanges.pipe(
            distinctUntilChanged(),
            map(values => values.securityInfo.x509CertificateAvailable)
        );

        this.hasCert$.pipe(
            takeUntil(this.ngUnsubscribe),
            distinctUntilChanged()
        ).subscribe(hasCert => {
                if (hasCert && !this.x509Certificates.length) {
                    this.addCert();
                    this.x509Certificates.setValidators(Validators.minLength(1));
                    this.x509Certificates.updateValueAndValidity();
                }
                if (!hasCert) {
                    while (this.x509Certificates.controls.length !== 0) {
                        this.removeCert(0);
                    }
                }
            });
    }

    ngOnChanges(): void {
        this.form.reset({
            securityInfo: this.resolver.securityInfo || {
                x509CertificateAvailable: false,
                authenticationRequestsSigned: false,
                wantAssertionsSigned: false
            }
        });
        if (this.resolver.securityInfo && this.resolver.securityInfo.x509CertificateAvailable) {
            this.setCertificates(this.resolver.securityInfo.x509Certificates);
        }
    }
} /* istanbul ignore next */