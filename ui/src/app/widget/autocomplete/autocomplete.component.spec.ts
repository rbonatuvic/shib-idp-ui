import { Component, ViewChild, SimpleChange, ElementRef } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { AutoCompleteComponent } from './autocomplete.component';

@Component({
    template: `<auto-complete [id]="config.id" [autoSelect]="config.autoSelect" [options]="config.options"></auto-complete>`
})
class TestHostComponent {
    config: any = {
        autoSelect: false,
        options: [],
        required: true,
        defaultValue: '',
        id: 'foo',
        allowCustom: true,
        noneFoundText: 'None Found'
    };

    @ViewChild(AutoCompleteComponent)
    public autoCompleteUnderTest: AutoCompleteComponent;

    configure(opts: any): void {
        this.config = Object.assign({}, this.config, opts);
    }
}

describe('AutoComplete Input Component', () => {
    let testHostInstance: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;
    let instanceUnderTest: AutoCompleteComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                NoopAnimationsModule,
                ReactiveFormsModule
            ],
            declarations: [
                AutoCompleteComponent,
                TestHostComponent
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostInstance = testHostFixture.componentInstance;
        instanceUnderTest = testHostInstance.autoCompleteUnderTest;
        testHostFixture.detectChanges();
    });

    it('should compile', () => {
        expect(testHostFixture).toBeDefined();
    });

    describe('ControlValueAccessor interface', () => {
        describe('writeValue method', () => {
            it('should set the value of the internal input element', () => {
                let val = 'foo';
                instanceUnderTest.writeValue(val);
                expect(instanceUnderTest.input.value).toBe(val);
            });
        });

        describe('registerOnChange method', () => {
            it('should set the onChange callback method', () => {
                let cb = jasmine.createSpy('registerOnChange');
                instanceUnderTest.registerOnChange(cb);
                instanceUnderTest.propagateChange('foo');
                expect(cb).toHaveBeenCalledWith('foo');
            });
        });

        describe('registerOnTouched method', () => {
            it('should set the onTouched callback method', () => {
                let cb = jasmine.createSpy('registerOnTouched');
                instanceUnderTest.registerOnTouched(cb);
                instanceUnderTest.propagateTouched(null);
                expect(cb).toHaveBeenCalledWith(null);
            });
        });

        describe('setDisabledState method', () => {
            it('should set the disabled property', () => {
                instanceUnderTest.setDisabledState(true);
                expect(instanceUnderTest.disabled).toBe(true);
            });
            it('should set the disabled property', () => {
                instanceUnderTest.setDisabledState();
                expect(instanceUnderTest.disabled).toBe(false);
            });
        });
    });

    describe('setValidation method', () => {
        let mockChanges = {
            disabled: new SimpleChange(false, true, false),
            required: new SimpleChange(false, true, false),
            allowCustom: new SimpleChange(false, false, true),
            focused: new SimpleChange(
                new ElementRef(document.createElement('input')),
                new ElementRef(document.createElement('input')),
                false
            )
        };
        it('should set disabled', () => {
            spyOn(instanceUnderTest.input, 'disable');
            instanceUnderTest.setDisabledState(true);
            instanceUnderTest.setValidation(mockChanges);
            expect(instanceUnderTest.input.disable).toHaveBeenCalled();
        });

        it('should enable', () => {
            spyOn(instanceUnderTest.input, 'enable');
            instanceUnderTest.setDisabledState(false);
            instanceUnderTest.setValidation(mockChanges);
            expect(instanceUnderTest.input.enable).toHaveBeenCalled();
        });

        it('should set required', () => {
            spyOn(instanceUnderTest.input, 'setValidators');
            instanceUnderTest.required = true;
            instanceUnderTest.setValidation(mockChanges);
            expect(instanceUnderTest.input.setValidators).toHaveBeenCalled();
        });

        it('should remove required', () => {
            spyOn(instanceUnderTest.input, 'clearValidators');
            instanceUnderTest.required = false;
            instanceUnderTest.setValidation(mockChanges);
            expect(instanceUnderTest.input.clearValidators).toHaveBeenCalled();
        });

        it('should update provided options', () => {
            let opts = ['foo'];
            spyOn(instanceUnderTest.state, 'setState');
            testHostInstance.configure({options: opts});
            testHostFixture.detectChanges();
            expect(instanceUnderTest.state.setState).toHaveBeenCalledWith({options: opts});
        });

        it('should set validator based on allowCustom', () => {
            spyOn(instanceUnderTest.input, 'clearAsyncValidators');
            instanceUnderTest.allowCustom = true;
            instanceUnderTest.setValidation({...mockChanges, allowCustom: new SimpleChange(false, true, false)});
            expect(instanceUnderTest.input.clearAsyncValidators).toHaveBeenCalled();
        });
    });

    describe('handleKeyDown method', () => {
        const keyCodes = {
            13: 'enter',
            27: 'escape',
            32: 'space',
            38: 'up',
            40: 'down'
        };
        it('should call the handleUpArrow handler when the up arrow key is entered', () => {
            spyOn(instanceUnderTest, 'handleUpArrow');
            instanceUnderTest.handleKeyDown({keyCode: 38} as KeyboardEvent);
            expect(instanceUnderTest.handleUpArrow).toHaveBeenCalled();
        });
        it('should call the handleKeyDown handler when the down arrow key is entered', () => {
            spyOn(instanceUnderTest, 'handleDownArrow');
            instanceUnderTest.handleKeyDown({ keyCode: 40 } as KeyboardEvent);
            expect(instanceUnderTest.handleDownArrow).toHaveBeenCalled();
        });

        it('should call the handleSpace handler when the arrow space is entered', () => {
            spyOn(instanceUnderTest, 'handleSpace');
            instanceUnderTest.handleKeyDown({ keyCode: 32 } as KeyboardEvent);
            expect(instanceUnderTest.handleSpace).toHaveBeenCalled();
        });

        it('should call the handleEnter when the enter key is entered', () => {
            spyOn(instanceUnderTest, 'handleEnter');
            instanceUnderTest.handleKeyDown({ keyCode: 13 } as KeyboardEvent);
            expect(instanceUnderTest.handleEnter).toHaveBeenCalled();
        });
        it('should call the handleComponentBlur when the escape key is entered', () => {
            spyOn(instanceUnderTest, 'handleComponentBlur');
            instanceUnderTest.handleKeyDown({ keyCode: 27 } as KeyboardEvent);
            expect(instanceUnderTest.handleComponentBlur).toHaveBeenCalled();
        });
    });

    xdescribe('handleEnter handler', () => {

    });

    describe('handleOptionMouseDown method', () => {
        it('should call the preventDefault method on the provided event', () => {
            let spy = jasmine.createSpy('preventDefault'),
                evt = {preventDefault: spy};
            instanceUnderTest.handleOptionMouseDown(evt);
            expect(evt.preventDefault).toHaveBeenCalled();
        });
    });

    describe('handleOptionMouseEnter method', () => {
        it('should update the current state with the provided index', () => {
            let index = 1;
            spyOn(instanceUnderTest.state, 'setState');
            instanceUnderTest.handleOptionMouseEnter(index);
            expect(instanceUnderTest.state.setState).toHaveBeenCalledWith({ hovered: index });
        });
    });

    describe('handleOptionMouseOut method', () => {
        it('should update the current state on the components model', () => {
            spyOn(instanceUnderTest.state, 'setState');
            instanceUnderTest.handleOptionMouseOut();
            expect(instanceUnderTest.state.setState).toHaveBeenCalledWith({hovered: null});
        });
    });

    describe('displayState getter function', () => {
        it('should return the current state', () => {
            let spy = spyOnProperty(instanceUnderTest.state, 'currentState', 'get');
            let state = instanceUnderTest.displayState;
            expect(state).toEqual({options: []});
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('hasAutoSelect getter', () => {
        it('should return true if not an ios device and autoSelect is set to true', () => {
            spyOn(instanceUnderTest, 'isIosDevice').and.returnValue(false);
            testHostInstance.configure({autoSelect: true});
            console.log(testHostInstance.config);
            testHostFixture.detectChanges();
            expect(instanceUnderTest.hasAutoselect).toBe(true);
        });

        it('should return false if an ios device', () => {
            spyOn(instanceUnderTest, 'isIosDevice').and.returnValue(true);
            expect(instanceUnderTest.hasAutoselect).toBe(false);
        });
    });

    describe('activeDescendant getter', () => {
        it('should return a formatted string of an item is focused', () => {
            let id = 'foo',
                focused = 1,
                matches = ['foo'];
            testHostInstance.configure({id});
            spyOnProperty(instanceUnderTest.state, 'currentState', 'get').and.returnValue({focused, matches});
            testHostFixture.detectChanges();
            expect(instanceUnderTest.activeDescendant).toBe(`${id}__option--${focused}`);
        });
    });
});
