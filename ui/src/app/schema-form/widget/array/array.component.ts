import { Component, AfterViewInit } from '@angular/core';

import { ArrayWidget } from 'ngx-schema-form';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { FormProperty } from 'ngx-schema-form/lib/model/formproperty';

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
export class CustomArrayComponent extends ArrayWidget implements AfterViewInit {
    errors$: Observable<FormError[]>;
    hasErrors$: Observable<boolean>;
    hasErrorSub: Subscription;

    messages = {
        ARRAY_UNIQUE: 'message.array-items-must-be-unique'
    };

    ngAfterViewInit(): void {
        this.errors$ = this.formProperty.errorsChanges.pipe(
            map(errors => errors ?
                errors.filter(err => err.code !== 'UNRESOLVABLE_REFERENCE').reduce((coll, err) => {
                    coll[err.code] = err;
                    return coll;
                }, {}) : {}),
            map(collection => Object.values(collection))
        );

        this.hasErrors$ = this.errors$.pipe(map(errors => !!errors.length));
    }

    removeItem(item: FormProperty = null): void {
        this.formProperty.properties = (<FormProperty[]>this.formProperty.properties).filter(i => i !== item);
        this.formProperty.updateValueAndValidity(false, true);
    }

    addItem(): void {
        super.addItem();
    }

    getListType(property: any): string {
        return property.properties.length ? property.properties[0].type : null;
    }
}
