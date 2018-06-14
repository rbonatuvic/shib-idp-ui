import { Observable, of } from 'rxjs';
import { map, take, startWith } from 'rxjs/operators';

import { AbstractControl } from '@angular/forms';

export class EntityValidators {
    static createUniqueIdValidator(ids$: Observable<string[]>) {
        return (control: AbstractControl) => {
            return ids$.pipe(
                map(ids => ids.filter(id => id === control.value)),
                map(ids => !!ids.length),
                map((isTaken: boolean) => isTaken ? { unique: true } : null),
                take(1)
            );
        };
    }

    static createOrgValidator() {
        return (control: AbstractControl) => {
            if (!control || !control.valueChanges) {
                return of(null);
            }
            return control.valueChanges.pipe(
                startWith(control.value),
                map(values => {
                    let keys = Object.keys(values),
                        hasValue = keys.reduce((val, key) => val + (values[key] ? values[key] : ''), ''),
                        allHaveValue = keys.reduce((val, key) => {
                            return !values[key] ? false : val;
                        }, true);
                    if (!hasValue) {
                        return true;
                    } else {
                        return allHaveValue;
                    }
                }),
                map(isValid => {
                    return !isValid ? { org: true } : null;
                }),
                take(1)
            );
        };
    }

    static existsInCollection(ids$: Observable<string[]>) {
        return (control: AbstractControl) => {
            return ids$.pipe(
                map(ids => ids.find(id => id === control.value)),
                map(ids => ids && !!ids.length),
                map((exists: boolean) => exists ? null : { exists: true }),
                take(1)
            );
        };
    }
}
