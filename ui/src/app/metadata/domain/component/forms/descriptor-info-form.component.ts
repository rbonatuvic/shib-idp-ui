import { Component, Input, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { ProviderFormFragmentComponent } from './provider-form-fragment.component';

import { ProviderStatusEmitter, ProviderValueEmitter } from '../../../domain/service/provider-change-emitter.service';
import { MetadataResolver } from '../../../domain/model';
import { ListValuesService } from '../../../domain/service/list-values.service';

@Component({
    selector: 'descriptor-info-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './descriptor-info-form.component.html'
})
export class DescriptorInfoFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() resolver: MetadataResolver;

    form: FormGroup;

    nameIdFormatOptions: Observable<string[]> = this.listValues.nameIdFormats;

    enumOptions: string[] = [
        'SAML 2',
        'SAML 1.1'
    ];

    nameIds$: Observable<string[]> = of([]);

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
            serviceProviderSsoDescriptor: this.fb.group({
                protocolSupportEnum: null,
                nameIdFormats: this.fb.array([])
            })
        });
    }

    ngOnChanges(): void {
        let descriptor = this.resolver.serviceProviderSsoDescriptor;
        this.form.reset({
            serviceProviderSsoDescriptor: descriptor || {}
        });
        this.setNameIdFormats(descriptor ? descriptor.nameIdFormats : []);
    }

    get nameIdFormats(): FormArray {
        return this.form.get('serviceProviderSsoDescriptor.nameIdFormats') as FormArray;
    }

    getRequiredControl = (name: string): FormControl => this.fb.control(name, Validators.required);

    setNameIdFormats(nameIdFormats: string[]): void {
        let fcs = nameIdFormats.map(this.getRequiredControl),
            list = this.fb.array(fcs),
            group = this.form.get('serviceProviderSsoDescriptor') as FormGroup;
        group.setControl('nameIdFormats', list);
    }

    addFormat(text: string = ''): void {
        this.nameIdFormats.push(this.fb.control(text, Validators.required));
    }

    removeFormat(index: number): void {
        this.nameIdFormats.removeAt(index);
    }

    updateOptions(query: string): void {
        this.nameIds$ = this.listValues.searchFormats(of(query));
    }

} /* istanbul ignore next */
