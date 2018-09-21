import {
    Component,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormControlName, Validators, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { take } from 'rxjs/operators';

import * as fromResolver from '../reducer';
import { EntityValidators } from '../../domain/service/entity-validators.service';
import { SearchIds } from '../action/search.action';
import * as fromProvider from '../reducer';
import { CreateResolverCopyRequest, UpdateResolverCopySections } from '../action/copy.action';


@Component({
    selector: 'copy-resolver-form',
    templateUrl: './copy-resolver.component.html'
})
export class CopyResolverComponent implements OnInit {
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
        private store: Store<fromResolver.ResolverState>,
        private fb: FormBuilder
    ) {
        this.ids$ = this.store.select(fromResolver.getAllEntityIds);
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
        this.store.dispatch(new CreateResolverCopyRequest({
            ...this.providerForm.value
        }));
    }

    onChange(attr: string): void {
        this.store.dispatch(
            new UpdateResolverCopySections(
                this.selected.indexOf(attr) > -1 ? this.selected.filter(a => a !== attr) : [...this.selected, attr]
            )
        );
    }

    onCheckAll(): void {
        this.store.dispatch(new UpdateResolverCopySections(this.sections.map(section => section.property)));
    }
    onCheckNone(event: Event | null = null): void {
        this.store.dispatch(new UpdateResolverCopySections([]));
    }
}
