import {
    Component,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormControlName, Validators, AbstractControl } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { startWith, take, last } from 'rxjs/operators';

import { AddDraftRequest } from '../../domain/action/draft-collection.action';
import { AddProviderRequest, UploadProviderRequest } from '../../domain/action/provider-collection.action';
import * as fromCollections from '../../domain/reducer';
import { EntityValidators } from '../../domain/service/entity-validators.service';
import { SearchIds } from '../action/search.action';
import * as fromProvider from '../reducer';
import { Provider } from '../../domain/entity/provider';
import { CreateProviderCopyRequest, UpdateProviderCopySections} from '../action/copy.action';


@Component({
    selector: 'copy-provider-form',
    templateUrl: './copy-provider.component.html'
})
export class CopyProviderComponent implements OnInit {
    @Output() save: EventEmitter<any> = new EventEmitter();

    providerForm: FormGroup;
    ids$: Observable<string[]>;
    searchResults$: Observable<string[]>;
    selected$: Observable<string[]>;
    selected: string[];

    sections = [
        { i18nKey: 'organizationInfo', property: 'organization' },
        { i18nKey: 'contacts', property: 'contacts' },
        { i18nKey: 'uiMduiInfo', property: 'mdui' },
        { i18nKey: 'spSsoDescriptorInfo', property: 'serviceProviderSsoDescriptor' },
        { i18nKey: 'logoutEndpoints', property: 'logoutEndpoints' },
        { i18nKey: 'securityDescriptorInfo', property: 'securityInfo' },
        { i18nKey: 'assertionConsumerServices', property: 'assertionConsumerServices' },
        { i18nKey: 'relyingPartyOverrides', property: 'relyingPartyOverrides' },
        { i18nKey: 'attributeRelease', property: 'attributeRelease' }
    ];

    sections$ = of(this.sections);

    constructor(
        private store: Store<fromCollections.CollectionState>,
        private fb: FormBuilder
    ) {
        this.ids$ = this.store.select(fromCollections.getAllEntityIds);
        this.searchResults$ = this.store.select(fromProvider.getSearchResults);
        this.selected$ = this.store.select(fromProvider.getSectionsToCopy);

        this.selected$.subscribe(selected => this.selected = selected);
    }

    ngOnInit(): void {
        this.providerForm = this.fb.group({
            serviceProviderName: ['', [Validators.required]],
            entityId: ['', Validators.required, EntityValidators.createUniqueIdValidator(this.ids$)],
            target: ['', [Validators.required], [EntityValidators.existsInCollection(this.ids$)]],
        });

        this.store.select(fromProvider.getAttributes)
            .pipe(take(1))
            .subscribe(attrs => this.providerForm.setValue({ ...attrs }));

        this.providerForm
            .get('target')
            .valueChanges
            .subscribe(val => {
                this.store.dispatch(new SearchIds(val));
            });
    }

    next(): void {
        this.store.dispatch(new CreateProviderCopyRequest({
            ...this.providerForm.value
        }));
    }

    onChange(attr: string): void {
        this.store.dispatch(
            new UpdateProviderCopySections(
                this.selected.indexOf(attr) > -1 ? this.selected.filter(a => a !== attr) : [...this.selected, attr]
            )
        );
    }

    onCheckAll(): void {
        this.store.dispatch(new UpdateProviderCopySections(this.sections.map(section => section.property)));
    }
    onCheckNone(event: Event | null = null): void {
        this.store.dispatch(new UpdateProviderCopySections([]));
    }
}
