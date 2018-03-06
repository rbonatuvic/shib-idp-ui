import { Component, Output, Input, EventEmitter, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ProviderFormFragmentComponent } from './provider-form-fragment.component';

import { ProviderStatusEmitter, ProviderValueEmitter } from '../../service/provider-change-emitter.service';
import { MetadataProvider, Organization, Contact } from '../../model/metadata-provider';
import { ListValuesService } from '../../service/list-values.service';

@Component({
    selector: 'descriptor-info-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './descriptor-info-form.component.html'
})
export class DescriptorInfoFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() provider: MetadataProvider;

    form: FormGroup;

    nameIdFormatOptions: Observable<string[]> = this.listValues.nameIdFormats;

    enumOptions: string[] = [
        'SAML 2',
        'SAML 1.1'
    ];

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
        let descriptor = this.provider.serviceProviderSsoDescriptor;
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
} /* istanbul ignore next */
