import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, NgControl, AbstractControl } from '@angular/forms';
import { ValidationClassDirective } from './validation-class.directive';

import * as constants from '../../shared/constant';

@Component({
    template: `<input type="text" class="form-control" required [ngModel]="foo">`
})
class TestComponent {
    foo = '';
}

describe('Validation Classes Directive', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let inputEl: DebugElement;
    let ctrl: AbstractControl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                FormsModule,
                ReactiveFormsModule
            ],
            declarations: [
                ValidationClassDirective,
                TestComponent
            ],
        });

        fixture = TestBed.createComponent(TestComponent);
        inputEl = fixture.debugElement.query(By.css('input'));
        ctrl = inputEl.injector.get(NgControl).control;
        fixture.detectChanges();
    });

    describe('directive', () => {
        it('should compile', () => {
            expect(inputEl).toBeDefined();
        });
    });

    describe('validation classes', () => {
        it('should add the is-invalid class when the control is invalid and has been touched', () => {
            ctrl.markAsTouched();
            fixture.detectChanges();
            expect(inputEl.classes['is-invalid']).toBe(true);
        });

        it('should add the is-valid class when the control is valid and has been touched', () => {
            ctrl.markAsTouched();
            ctrl.setValue('foo');
            fixture.detectChanges();
            expect(inputEl.classes['is-valid']).toBe(true);
        });
    });
});
