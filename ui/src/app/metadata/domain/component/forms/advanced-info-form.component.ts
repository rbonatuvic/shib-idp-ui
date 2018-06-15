import { Component, Input, OnInit, OnChanges, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable, Subscription, of } from 'rxjs';
import { takeUntil, combineLatest, switchMap, map, startWith } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { ProviderStatusEmitter, ProviderValueEmitter } from '../../../domain/service/provider-change-emitter.service';
import { MetadataResolver, Contact } from '../../../domain/model';
import { ProviderFormFragmentComponent } from './provider-form-fragment.component';
import { EntityValidators } from '../../../domain/service/entity-validators.service';
import * as fromMetadata from '../../../metadata.reducer';

@Component({
    selector: 'adv-info-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './advanced-info-form.component.html'
})
export class AdvancedInfoFormComponent extends ProviderFormFragmentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() resolver: MetadataResolver;

    contactTypes: string[] = [
        'support',
        'technical',
        'administrative',
        'other'
    ];

    form: FormGroup;

    hasValue$: Observable<boolean>;
    totalValue$: Observable<string>;
    ids$: Observable<string[]> = of([]);

    private validationSubscription: Subscription;

    constructor(
        protected fb: FormBuilder,
        protected statusEmitter: ProviderStatusEmitter,
        protected valueEmitter: ProviderValueEmitter,
        protected store: Store<fromMetadata.MetadataState>
    ) {
        super(fb, statusEmitter, valueEmitter);

        /*
        this.ids$ = this.store
            .select(fromCollection.getAllEntityIds)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                combineLatest(this.store.select(fromCollection.getSelectedProvider), (ids: string[], provider: MetadataResolver) => {
                    return ids.filter(id => provider.entityId !== id);
                })
            );
            */
    }

    createForm(): void {
        let orgEmitter$ = this.valueEmitter.changeEmitted$.pipe(
            takeUntil(this.ngUnsubscribe),
            switchMap(changes => of(changes.organization))
        );
        this.form = this.fb.group({
            entityId: ['', Validators.required],
            serviceProviderName: ['', Validators.required],
            serviceEnabled: [false],
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

        this.hasValue$ = this.form
            .get('organization')
            .valueChanges.pipe(
                startWith(this.form.get('organization').value),
                map(values => Object.keys(values).reduce((coll, key) => coll + (values[key] || ''), '')),
                map(value => !!value)
            );

        this.form
            .get('entityId')
            .setAsyncValidators(
                EntityValidators.createUniqueIdValidator(this.ids$)
            );
    }

    ngOnChanges(): void {
        this.resolver.organization = this.resolver.organization || {};
        this.resolver.contacts = this.resolver.contacts || [];
        this.form.reset({
            serviceProviderName: this.resolver.serviceProviderName,
            serviceEnabled: this.resolver.serviceEnabled,
            entityId: this.resolver.entityId,
            organization: this.resolver.organization
        });
        this.setContacts(this.resolver.contacts);
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
            type: [contact.type || null, Validators.required],
            name: [contact.name || null, Validators.required],
            emailAddress: [contact.emailAddress || null, [Validators.required, Validators.email]]
        });
    }

    removeContact(index: number): void {
        this.contacts.removeAt(index);
    }
} /* istanbul ignore next */
