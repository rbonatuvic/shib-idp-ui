import { Component, AfterViewInit, OnDestroy } from '@angular/core';

import { ArrayWidget } from 'ngx-schema-form';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

export interface FormError {
    code: string;
    description: string;
    message: string;
    params: any[];
    path: string;
    schemaId: any;
}

@Component({
    selector: 'array-component',
    templateUrl: `./array.component.html`
})
export class CustomArrayComponent extends ArrayWidget implements AfterViewInit, OnDestroy {
    errors$: Observable<FormError[]>;
    hasErrors: boolean;
    hasErrorSub: Subscription;

    messages = {
        ARRAY_UNIQUE: 'message.array-items-must-be-unique'
    };

    ngAfterViewInit(): void {
        this.errors$ = this.formProperty.errorsChanges.pipe(
            map(errors => errors ? errors.reduce((coll, err) => {
                coll[err.code] = err;
                return coll;
            }, {}) : {}),
            map(collection => Object.values(collection))
        );

        this.hasErrorSub = this.errors$.subscribe(e => this.hasErrors = !!e.length);
    }

    ngOnDestroy(): void {
        this.hasErrorSub.unsubscribe();
    }
    getListType(property: any): string {
        return property.properties.length ? property.properties[0].type : null;
    }
}
