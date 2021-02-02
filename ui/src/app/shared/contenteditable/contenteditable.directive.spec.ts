import { Component, DebugElement, Renderer2 } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ContenteditableDirective } from './contenteditable.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MockI18nModule } from '../../../testing/i18n.stub';



@Component({
    template: `<div contenteditable="true" [formControl]="control"></div>`
})
class TestComponent {
    control: FormControl = new FormControl('');
}

describe('Content Editable Directive', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let renderer: Renderer2;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Renderer2, useClass: Renderer2 }
            ],
            imports: [
                ReactiveFormsModule,
                MockI18nModule
            ],
            declarations: [
                ContenteditableDirective,
                TestComponent
            ],
        });

        fixture = TestBed.createComponent(TestComponent);
        element = fixture.debugElement.query(By.css('div'));
        fixture.detectChanges();

        renderer = TestBed.get(Renderer2);
    });

    describe('functions', () => {
        it('should compile', () => {
            expect(element).toBeDefined();
        });
    });

    describe('setDisabledState', () => {
        it('should set the field to disabled', () => {
            fixture.componentInstance.control.disable();
            expect(element.attributes.disabled).toBeDefined();
        });

        it('should set the field to enabled', () => {
            fixture.componentInstance.control.disable();
            fixture.detectChanges();
            fixture.componentInstance.control.enable();
            expect(element.attributes.disabled).toBeUndefined();
        });

        it('should set the field to enabled', () => {
            fixture.componentInstance.control.enable();
            expect(element.attributes.disabled).toBeUndefined();
        });
    });
});
