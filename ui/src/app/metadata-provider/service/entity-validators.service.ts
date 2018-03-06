import { Observable } from 'rxjs/Observable';
import { AbstractControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

export class EntityValidators {
    static createUniqueIdValidator(ids$: Observable<string[]>) {
        return (control: AbstractControl) => {
            return ids$
                .map(ids => ids.filter(id => id === control.value))
                .map(ids => !!ids.length)
                .map((isTaken: boolean) => {
                    return isTaken ? { unique: true } : null;
                })
                .take(1);
        };
    }

    static createOrgValidator() {
        return (control: AbstractControl) => {
            if (!control || !control.valueChanges) {
                return Observable.of(null);
            }
            return control.valueChanges
                .startWith(control.value)
                .map(values => {
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
                })
                .map(isValid => {
                    return !isValid ? { org: true } : null;
                })
                .take(1);
        };
    }
}
