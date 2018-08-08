import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ObjectWidget } from 'ngx-schema-form';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, skipWhile } from 'rxjs/operators';

import * as fromRoot from '../../../app.reducer';
import * as fromFilters from '../../../metadata/filter/reducer';

import { QueryEntityIds, ClearSearch } from '../../../metadata/filter/action/search.action';
import { EntityValidators } from '../../../metadata/domain/service/entity-validators.service';

/* istanbul ignore next */
@Component({
    selector: 'filter-target',
    templateUrl: `./filter-target.component.html`,
    styleUrls: ['./filter-target.component.scss']
})
export class FilterTargetComponent extends ObjectWidget implements OnDestroy, AfterViewInit {

    ids$: Observable<string[]>;
    ids: string[];

    search: FormControl = new FormControl(
        '',
        [],
        [EntityValidators.existsInCollection(this.store.select(fromFilters.getEntityCollection))]
    );

    script: FormControl = new FormControl(
        '',
        [Validators.required]
    );

    constructor(
        private store: Store<fromRoot.State>
    ) {
        super();
        this.ids$ = this.store.select(fromFilters.getEntityCollection);
        this.ids$.subscribe(ids => this.ids = ids);

        this.search
            .valueChanges
            .pipe(distinctUntilChanged())
            .subscribe(query => this.searchEntityIds(query));

        this.script
            .valueChanges
            .pipe(
                distinctUntilChanged(),
                skipWhile(() => this.entityAttributesFilterTargetType === 'ENTITY')
            )
            .subscribe(script => {
                this.setTargetValue([script]);
            });
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.script.setValue(this.targets[0]);
    }

    searchEntityIds(term: string): void {
        if (term && term.length >= 4 && this.ids.indexOf(term) < 0) {
            this.store.dispatch(new QueryEntityIds({
                term,
                limit: 10
            }));
        }
    }

    get targets(): string[] {
        return this.formProperty.getProperty('value').value;
    }

    get entityAttributesFilterTargetType(): string {
        return this.formProperty.getProperty('entityAttributesFilterTargetType').value;
    }

    get displayType(): string {
        return this.typeOptions.find(opt => opt.value === this.entityAttributesFilterTargetType).description;
    }

    get typeOptions(): any[] {
        return this.formProperty
                    .getProperty('entityAttributesFilterTargetType')
                    .schema
                    .oneOf
                    .map(option => ({ ...option, value: option.enum[0] }));
    }

    select(value: string): void {
        this.formProperty.getProperty('entityAttributesFilterTargetType').setValue(value);
        this.setTargetValue([]);
        this.script.setValue(null);
        this.search.setValue(null);
    }

    setTargetValue(value: string[]): void {
        this.formProperty.getProperty('value').setValue(value);
    }

    onSelectValue(value: string): void {
        this.setTargetValue([...this.formProperty.getProperty('value').value, value]);
        this.search.reset(null);
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ClearSearch());
    }
}