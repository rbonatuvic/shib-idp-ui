import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import 'rxjs/add/observable/of';

import * as AutoCompleteValidators from './autocomplete-validators.service';

let ids = ['foo', 'bar', 'baz'];

describe(`existsInCollection`, () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule
            ],
            providers: [
                FormBuilder
            ]
        });
    });

    describe('createUniqueIdValidator', () => {
        it('should detect that a provided id is in the collection', async(inject([FormBuilder], (fb) => {
            let obs = Observable.of(ids),
                validator = AutoCompleteValidators.existsInCollection(obs),
                ctrl = fb.control('foo');
            validator(ctrl).subscribe(next => {
                expect(next).toBeNull();
            });
        })));

        it('should detect that a provided id is not in the collection', async(inject([FormBuilder], (fb) => {
            let obs = Observable.of(ids),
                validator = AutoCompleteValidators.existsInCollection(obs),
                ctrl = fb.control('hi');
            validator(ctrl).subscribe(next => {
                expect(next).toBeTruthy();
            });
        })));
    });
});
