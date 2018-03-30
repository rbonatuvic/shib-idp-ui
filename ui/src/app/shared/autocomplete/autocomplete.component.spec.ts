import { Component, ViewChild, SimpleChange, ElementRef, SimpleChanges } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { AutoCompleteComponent } from './autocomplete.component';
import { NavigatorService } from '../../core/service/navigator.service';
import { ValidationClassDirective } from '../validation/validation-class.directive';
import { HighlightPipe } from '../pipe/highlight.pipe';

const iPodAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X)
    AppleWebKit/534.46 (KHTML, like Gecko)
    Version/5.1 Mobile/9A334 Safari/7534.48.3`;
const regularAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3)
    AppleWebKit/537.36 (KHTML, like Gecko)
    Chrome/64.0.3282.186 Safari/537.36`;

@Component({
    template: `
        <div [formGroup]="group">
            <auto-complete
                [id]="config.id"
                [autoSelect]="config.autoSelect"
                [matches]="config.options"
                formControlName="search"
                (onChange)="search($event)">
            </auto-complete>
        </div>
    `
})
class TestHostComponent {
    config: any = {
        autoSelect: false,
        options: [],
        defaultValue: '',
        id: 'foo',
        allowCustom: false,
        noneFoundText: 'None Found',
        disabled: false
    };

    constructor(public fb: FormBuilder) {}

    group = this.fb.group({
        search: ['']
    });

    @ViewChild(AutoCompleteComponent)
    public autoCompleteUnderTest: AutoCompleteComponent;

    configure(opts: any): void {
        this.config = Object.assign({}, this.config, opts);
    }

    search(query: string = ''): void {}
}

describe('AutoComplete Input Component', () => {
    let testHostInstance: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;
    let instanceUnderTest: AutoCompleteComponent;
    let navigatorInstance: NavigatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                NavigatorService
            ],
            imports: [
                NoopAnimationsModule,
                FormsModule,
                ReactiveFormsModule
            ],
            declarations: [
                AutoCompleteComponent,
                TestHostComponent,
                ValidationClassDirective,
                HighlightPipe
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostInstance = testHostFixture.componentInstance;
        instanceUnderTest = testHostInstance.autoCompleteUnderTest;
        navigatorInstance = TestBed.get(NavigatorService);
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
            it('should set the disabled property to true', () => {
                testHostInstance.group.get('search').disable();
                testHostFixture.detectChanges();
                expect(instanceUnderTest.input.disabled).toBe(true);
            });
            it('should set the disabled property to false', () => {
                testHostInstance.group.get('search').enable();
                testHostFixture.detectChanges();
                expect(instanceUnderTest.input.disabled).toBe(false);
            });

            it('should set the disabled property to false if not provided', () => {
                instanceUnderTest.setDisabledState();
                expect(instanceUnderTest.input.disabled).toBe(false);
            });
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

    describe('handleComponentBlur handler', () => {
        const opts = ['foo', 'bar', 'baz'];
        it('should set a new state', () => {
            instanceUnderTest.state.setState({ selected: 0 });
            spyOn(instanceUnderTest.state, 'setState');
            instanceUnderTest.handleComponentBlur({menuOpen: true});
            expect(instanceUnderTest.state.setState).toHaveBeenCalledWith({
                focused: null,
                selected: null,
                menuOpen: true
            });
        });

        it('should set the menuOpen state to false if not provided', () => {
            instanceUnderTest.state.setState({ selected: 0 });
            spyOn(instanceUnderTest.state, 'setState');
            instanceUnderTest.handleComponentBlur();
            expect(instanceUnderTest.state.setState).toHaveBeenCalledWith({
                focused: null,
                selected: null,
                menuOpen: false
            });
        });

        it('should allow custom values when the property is set', () => {
            const val = 'hi';
            testHostInstance.configure({allowCustom: true});
            instanceUnderTest.input.setValue(val);
            instanceUnderTest.state.setState({ selected: -1 });
            testHostFixture.detectChanges();
            spyOn(instanceUnderTest, 'propagateChange');
            instanceUnderTest.handleComponentBlur();
            expect(instanceUnderTest.propagateChange).toHaveBeenCalledWith(val);
        });

        it('should detect if query is in current options', () => {
            const val = 'foo';
            instanceUnderTest.input.setValue(val);
            testHostInstance.configure({options: [val]});
            instanceUnderTest.state.setState({ selected: -1 });
            testHostFixture.detectChanges();
            spyOn(instanceUnderTest, 'propagateChange');
            instanceUnderTest.handleComponentBlur();
            expect(instanceUnderTest.propagateChange).toHaveBeenCalledWith('foo');
        });
    });

    describe('handleEnter handler', () => {
        const opts = ['foo', 'bar', 'baz'];
        it('should call preventDefault on the provided event if the menu is currently open', () => {
            const ev = { preventDefault: () => {} } as KeyboardEvent;
            spyOn(ev, 'preventDefault');
            instanceUnderTest.state.setState({ menuOpen: true});
            instanceUnderTest.handleEnter(ev);
            expect(ev.preventDefault).toHaveBeenCalled();
        });
        it('should NOT call preventDefault on the provided event if the menu is not open', () => {
            const ev = { preventDefault: () => { } } as KeyboardEvent;
            spyOn(ev, 'preventDefault');
            instanceUnderTest.state.setState({ menuOpen: false });
            instanceUnderTest.handleEnter(ev);
            expect(ev.preventDefault).not.toHaveBeenCalled();
        });

        it('should call componentBlur if there is no selected option and the query is not in the options', () => {
            const ev = { preventDefault: () => { } } as KeyboardEvent;
            spyOn(ev, 'preventDefault');
            spyOn(instanceUnderTest, 'handleComponentBlur');
            instanceUnderTest.state.setState({ menuOpen: true, selected: -1 });
            instanceUnderTest.handleEnter(ev);
            expect(instanceUnderTest.handleComponentBlur).toHaveBeenCalledWith({
                focused: -1,
                selected: -1,
                menuOpen: false
            });
        });

        it('should call handleOptionClick if there is no selected option but the query is in the options', () => {
            const i = 0;
            const val = opts[i];
            const ev = { preventDefault: () => { } } as KeyboardEvent;
            spyOn(ev, 'preventDefault');
            testHostInstance.configure({ options: opts });
            instanceUnderTest.input.setValue(val);
            testHostFixture.detectChanges();
            spyOn(instanceUnderTest, 'handleOptionClick');
            instanceUnderTest.state.setState({ menuOpen: true, selected: -1 });
            instanceUnderTest.handleEnter(ev);
            expect(instanceUnderTest.handleOptionClick).toHaveBeenCalledWith(i);
        });
    });

    describe('handleInputFocus handler', () => {
        it('should set the state focused attribute to the input fields index', () => {
            spyOn(instanceUnderTest.state, 'setState');
            instanceUnderTest.handleInputFocus();
            expect(instanceUnderTest.state.setState).toHaveBeenCalledWith({focused: -1});
        });
    });

    describe('handleOptionFocus handler', () => {
        it('should set the state focused attribute to the focused option', () => {
            spyOn(instanceUnderTest.state, 'setState');
            instanceUnderTest.handleOptionFocus(1);
            expect(instanceUnderTest.state.setState).toHaveBeenCalledWith({focused: 1, selected: 1});
        });
    });

    describe('handleOptionClick handler', () => {
        const expected = {
            menuOpen: false,
            focused: -1,
            selected: -1
        };
        it('should set the state to menuOpen: false, focused to -1, selected to -1, and the query to the selected option', () => {
            const val = 'foo';
            instanceUnderTest.input.setValue(val);
            testHostInstance.configure({ options: [val, 'bar', 'baz'] });
            testHostFixture.detectChanges();
            spyOn(instanceUnderTest.state, 'setState');
            instanceUnderTest.handleOptionClick(0);
            expect(instanceUnderTest.state.setState).toHaveBeenCalledWith(expected);
        });

        it('should call propagateChange if the selected option is in the list of matches', () => {
            const val = 'foo';
            instanceUnderTest.input.setValue(val);
            testHostInstance.configure({ options: [val, 'bar', 'baz'] });
            testHostFixture.detectChanges();
            spyOn(instanceUnderTest, 'propagateChange');
            instanceUnderTest.handleOptionClick(0);
            expect(instanceUnderTest.propagateChange).toHaveBeenCalledWith(val);
        });
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
            expect(state).toEqual({});
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('hasAutoSelect getter', () => {
        it('should return true if not an ios device and autoSelect is set to true', () => {
            spyOn(instanceUnderTest, 'isIosDevice').and.returnValue(false);
            testHostInstance.configure({autoSelect: true});
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

    describe('isIosDevice method', () => {
        it('should return true if navigator.userAgent is an ipad', () => {
            spyOnProperty(navigatorInstance, 'native', 'get').and.returnValue({ userAgent: iPodAgent });
            expect(instanceUnderTest.isIosDevice()).toBe(true);
        });
        it('should return false if navigator.userAgent is not an ios device', () => {
            spyOnProperty(navigatorInstance, 'native', 'get').and.returnValue({ userAgent: regularAgent });
            expect(instanceUnderTest.isIosDevice()).toBe(false);
        });
    });
});
