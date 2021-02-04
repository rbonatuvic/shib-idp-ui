import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ObjectWidget } from 'ngx-schema-form';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, skipWhile, takeUntil, map, withLatestFrom, filter, switchMap, startWith } from 'rxjs/operators';

import * as fromRoot from '../../../app.reducer';
import * as fromFilters from '../../../metadata/filter/reducer';

import { QueryEntityIds, ClearSearch } from '../../../metadata/filter/action/search.action';

/* istanbul ignore next */
@Component({
    selector: 'filter-target',
    templateUrl: `./filter-target.component.html`,
    styleUrls: ['./filter-target.component.scss']
})
export class FilterTargetComponent extends ObjectWidget implements OnDestroy, AfterViewInit {
    private ngUnsubscribe: Subject<null> = new Subject<null>();
    ids$: Observable<string[]>;
    idCount$: Observable<number>;

    search: FormControl = new FormControl(
        '',
        [],
        []
    );

    script: FormControl = new FormControl(
        '',
        [Validators.required]
    );

    errors$: Observable<any[]>;
    hasErrors$: Observable<boolean>;

    constructor(
        private store: Store<fromRoot.State>
    ) {
        super();
        this.ids$ = this.store.select(fromFilters.getEntityCollection);

        this.idCount$ = this.ids$.pipe(map(list => list.length));

        this.search
            .valueChanges
            .pipe(
                takeUntil(this.ngUnsubscribe),
                distinctUntilChanged(),
                withLatestFrom(this.ids$),
                filter(([term, ids]) => term && term.length >= 4 && ids.indexOf(term) < 0),
                map(([term]) => new QueryEntityIds({
                    term,
                    limit: 10
                }))
            )
            .subscribe(action => this.store.dispatch(action));

        this.script
            .valueChanges
            .pipe(
                takeUntil(this.ngUnsubscribe),
                distinctUntilChanged(),
                skipWhile(() => this.targetType === 'ENTITY')
            )
            .subscribe(script => {
                this.setTargetValue([script]);
            });
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.script.setValue(this.targets[0]);
        this.search.setValidators(this.unique());

        this.errors$ = this.formProperty.errorsChanges.pipe(
            map(errors =>
                errors && errors.length > 1 ?
                    Array
                    .from(new Set(errors.filter(e => e.code !== 'ARRAY_LENGTH_SHORT').map(e => e.code)))
                    .map(id => ({ ...errors.find(e => e.code === id) }))
                    : []
        ));

        this.errors$
            .pipe(
                takeUntil(this.ngUnsubscribe),
                map(errors => errors.reduce((collection, e) => ({ ...collection, [e.code]: e.message }), {})),
                map(errors => Object.keys(errors).length > 0 ? errors : null)
            )
            .subscribe(errors => this.script.setErrors(
                errors,
                {
                    emitEvent: true
                }
            )
        );

        this.hasErrors$ = this.errors$.pipe(map(e => e && e.length > 0));
    }

    unique(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            return this.targets.indexOf(control.value) > -1 ? { unique: true } : null;
        };
    }

    getButtonConfig(id: string): any {
        let buttons = this.formProperty.getProperty('value').schema.buttons;
        return (buttons || []).map(btn => ({
            ...btn,
            parameters: {
                id
            }
        }));
    }

    get targets(): string[] {
        return this.formProperty.getProperty('value').value;
    }

    get targetType(): string {
        return this.formProperty.getProperty(this.targetAttribute).value;
    }

    get displayType(): string {
        if (!this.targetAttribute) {
            return null;
        }
        return this.typeOptions.find(opt => opt.value === this.targetType).description;
    }

    get targetAttribute(): string {
        return this.formProperty.schema.widget.target;
    }

    get typeOptions(): any[] {
        return this.formProperty
                    .getProperty(this.targetAttribute)
                    .schema
                    .oneOf
                    .map(option => ({ ...option, value: option.enum[0] }));
    }

    select(value: string): void {
        this.formProperty.getProperty(this.targetAttribute).setValue(value);
        this.setTargetValue([]);
        this.script.reset();
        this.search.reset();
    }

    removeId(id: string): void {
        let rest = this.targets.filter(target => target !== id);
        this.setTargetValue(rest);
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
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
