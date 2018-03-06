import { Component, DebugElement, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbPopover, NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

import { InfoLabelDirective } from './info-label.directive';
import * as utility from '../../../testing/utility';


@Component({
    template: `<i class="info-icon fa fa-info-circle text-primary fa-lg"
                [ngbPopover]="tooltipName"></i>`
})
class TestComponent {
    tooltipName = 'Foobar!';
}

describe('Info Label Directive', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let config: NgbPopover;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NgbPopover, NgbPopoverConfig],
            imports: [
                NgbPopoverModule
            ],
            declarations: [
                InfoLabelDirective,
                TestComponent
            ],
        });

        fixture = TestBed.createComponent(TestComponent);
        element = fixture.debugElement.query(By.css('i.info-icon'));
        config = element.injector.get(NgbPopover);
        fixture.detectChanges();
    });

    describe('functions', () => {
        it('should compile', () => {
            expect(element).toBeDefined();
        });
        it('should call the config open method when spacebar is pressed', () => {
            spyOn(config, 'open');
            utility.dispatchKeyboardEvent(element.nativeElement, 'keydown', 'space');
            fixture.detectChanges();
            expect(config.open).toHaveBeenCalled();
        });
        it('should call the config close method when spacebar is released', () => {
            spyOn(config, 'close');
            utility.dispatchKeyboardEvent(element.nativeElement, 'keyup', 'space');
            fixture.detectChanges();
            expect(config.close).toHaveBeenCalled();
        });
    });
});
