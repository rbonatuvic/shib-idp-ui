import { TestBed, async, inject } from '@angular/core/testing';
import { EntityValidators } from './entity-validators.service';
import { Observable } from 'rxjs/Observable';
import { AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import 'rxjs/add/observable/of';

let ids = ['foo', 'bar', 'baz'];

describe(`EntityDescriptorService`, () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule
            ],
            providers: [
                EntityValidators
            ]
        });
    });

    describe('createUniqueIdValidator', () => {
        it('should detect that a provided id is already used', async(inject([FormBuilder], (fb) => {
            let obs = Observable.of(ids),
                validator = EntityValidators.createUniqueIdValidator(obs),
                ctrl = fb.control('foo');
            validator(ctrl).subscribe(next => {
                expect(next).toBeTruthy();
            });
        })));

        it('should detect that a provided id is NOT already used', async(inject([FormBuilder], (fb) => {
            let obs = Observable.of(ids),
                validator = EntityValidators.createUniqueIdValidator(obs),
                ctrl = fb.control('hi');
            validator(ctrl).subscribe(next => {
                expect(next).toBeFalsy();
            });
        })));
    });

    describe('createOrgValidator', () => {
        it('should detect that all controls in a group have a value', async(inject([FormBuilder], (fb) => {
            let validator = EntityValidators.createOrgValidator(),
                group = fb.group({
                    foo: '',
                    bar: '',
                    baz: ''
                });
            group.get('baz').patchValue('123');
            group.updateValueAndValidity();
            validator(group).subscribe(next => {
                expect(next).toBeTruthy();
            });
        })));

        it('should not validate if all controls are empty', async(inject([FormBuilder], (fb) => {
            let validator = EntityValidators.createOrgValidator(),
                group = fb.group({
                    foo: '',
                    bar: '',
                    baz: ''
                });
            validator(group).subscribe(next => {
                expect(next).toBeFalsy();
            });
        })));

        it('should not validate if all controls are empty', async(inject([FormBuilder], (fb) => {
            let validator = EntityValidators.createOrgValidator(),
                group = fb.group({
                    foo: '',
                    bar: '',
                    baz: ''
                });
            group.get('foo').patchValue('123');
            group.get('bar').patchValue('456');
            group.get('baz').patchValue('789');
            group.updateValueAndValidity();
            validator(group).subscribe(next => {
                expect(next).toBeFalsy();
            });
        })));

        it('should return an empty observable when no control is provided', async(inject([FormBuilder], (fb) => {
            let validator = EntityValidators.createOrgValidator();
            validator(null).subscribe(next => {
                expect(next).toBeFalsy();
            });
        })));
    });
});
