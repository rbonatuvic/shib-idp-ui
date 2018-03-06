import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterStub } from '../../../testing/router.stub';
import { NgbModalStub } from '../../../testing/modal.stub';
import { InputDefaultsDirective } from './input-defaults.directive';

import * as constants from '../../shared/constant';

@Component({
    template: `<input type="text" class="form-control" [disableDefaults]="disableDefaults">`
})
class TestComponent {
    isDisabled = false;
    set disableDefaults(isDisabled: boolean) {
        this.isDisabled = isDisabled;
    }
    get disableDefaults(): boolean {
        return this.isDisabled;
    }
}

describe('Input Defaults Directive', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let inputEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                FormsModule,
                ReactiveFormsModule
            ],
            declarations: [
                InputDefaultsDirective,
                TestComponent
            ],
        });

        fixture = TestBed.createComponent(TestComponent);
        inputEl = fixture.debugElement.query(By.css('input'));
    });

    describe('attributes', () => {
        it('should add a maxlength attribute based on the constants file', () => {
            fixture.detectChanges();
            expect(parseInt(inputEl.attributes.maxlength, 10)).toEqual(constants.DEFAULT_FIELD_MAX_LENGTH);
        });

        it('should be null if disableDefaults is set', () => {
            fixture.componentInstance.disableDefaults = true;
            fixture.detectChanges();
            expect(inputEl.attributes.maxlength).toBeNull();
        });
    });
});
