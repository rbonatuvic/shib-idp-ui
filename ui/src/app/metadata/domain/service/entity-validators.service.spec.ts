import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { EntityValidators } from './entity-validators.service';
import { Observable, of } from 'rxjs';
import { AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';

let ids = ['foo', 'bar', 'baz'];

describe(`Entity Validators service`, () => {

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
        it('should detect that a provided id is already used', waitForAsync(inject([FormBuilder], (fb) => {
            let obs = of(ids),
                validator = EntityValidators.createUniqueIdValidator(obs),
                ctrl = fb.control('foo');
            validator(ctrl).subscribe(next => {
                expect(next).toBeTruthy();
            });
        })));

        it('should detect that a provided id is NOT already used', waitForAsync(inject([FormBuilder], (fb) => {
            let obs = of(ids),
                validator = EntityValidators.createUniqueIdValidator(obs),
                ctrl = fb.control('hi');
            validator(ctrl).subscribe(next => {
                expect(next).toBeFalsy();
            });
        })));
    });

    describe('createOrgValidator', () => {
        it('should detect that all controls in a group have a value', waitForAsync(inject([FormBuilder], (fb) => {
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

        it('should not validate if all controls are empty', waitForAsync(inject([FormBuilder], (fb) => {
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

        it('should not validate if all controls are empty', waitForAsync(inject([FormBuilder], (fb) => {
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

        it('should return an empty observable when no control is provided', waitForAsync(inject([FormBuilder], (fb) => {
            let validator = EntityValidators.createOrgValidator();
            validator(null).subscribe(next => {
                expect(next).toBeFalsy();
            });
        })));
    });

    describe('createUniqueIdValidator', () => {
        it('should detect that a provided id is in the collection', waitForAsync(inject([FormBuilder], (fb) => {
            let obs = of(ids),
                validator = EntityValidators.existsInCollection(obs),
                ctrl = fb.control('foo');
            validator(ctrl).subscribe(next => {
                expect(next).toBeNull();
            });
        })));

        it('should detect that a provided id is not in the collection', waitForAsync(inject([FormBuilder], (fb) => {
            let obs = of(ids),
                validator = EntityValidators.existsInCollection(obs),
                ctrl = fb.control('hi');
            validator(ctrl).subscribe(next => {
                expect(next).toBeTruthy();
            });
        })));
    });
});
