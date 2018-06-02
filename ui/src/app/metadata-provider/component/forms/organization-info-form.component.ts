import { Component, Input, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { ProviderStatusEmitter, ProviderValueEmitter } from '../../../domain/service/provider-change-emitter.service';
import { MetadataProvider, Organization, Contact } from '../../../domain/model/metadata-provider';
import { ProviderFormFragmentComponent } from './provider-form-fragment.component';
import { EntityValidators } from '../../../domain/service/entity-validators.service';
import * as patterns from '../../../shared/regex';

@Component({
    selector: 'org-info-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './organization-info-form.component.html'
})
export class OrganizationInfoFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() provider: MetadataProvider;

    contactTypes: string[] = [
        'support',
        'technical',
        'administrative',
        'other'
    ];

    form: FormGroup;

    hasValue$: Observable<boolean>;
    totalValue$: Observable<string>;

    private validationSubscription: Subscription;

    constructor(
        protected fb: FormBuilder,
        protected statusEmitter: ProviderStatusEmitter,
        protected valueEmitter: ProviderValueEmitter
    ) {
        super(fb, statusEmitter, valueEmitter);
    }

    createForm(): void {
        this.form = this.fb.group({
            organization: this.fb.group({
                name: [''],
                displayName: [''],
                url: ['']
            }, { asyncValidator: EntityValidators.createOrgValidator() }),
            contacts: this.fb.array([])
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.hasValue$ = this.form.get('organization').valueChanges.pipe(
            startWith(this.form.get('organization').value),
            map(values => Object.keys(values).reduce((coll, key) => coll + (values[key] || ''), '')),
            map(value => !!value)
        );
    }

    ngOnChanges(): void {
        this.provider.organization = this.provider.organization || {};
        this.provider.contacts = this.provider.contacts || [];
        this.form.reset({
            organization: this.provider.organization
        });
        this.setContacts(this.provider.contacts);
    }

    get contacts(): FormArray {
        return this.form.get('contacts') as FormArray;
    }

    setContacts(contacts: Contact[] = []): void {
        let fgs = contacts.map(contact => this.getContact(contact)),
            list = this.fb.array(fgs);
        this.form.setControl('contacts', list);
    }

    addContact(): void {
        this.contacts.push(this.getContact());
    }

    getContact(contact: Contact = {} as Contact): FormGroup {
        return this.fb.group({
            type: [contact.type || '', Validators.required],
            name: [contact.name || '', Validators.required],
            emailAddress: [contact.emailAddress || null, [Validators.required, Validators.email]]
        });
    }

    removeContact(index: number): void {
        this.contacts.removeAt(index);
    }
} /* istanbul ignore next */
