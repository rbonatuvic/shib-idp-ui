import { Component, ViewChild, SimpleChange, ElementRef, SimpleChanges } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { AutoCompleteComponent } from './autocomplete.component';
import { NavigatorService } from '../../core/service/navigator.service';

const iPodAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X)
    AppleWebKit/534.46 (KHTML, like Gecko)
    Version/5.1 Mobile/9A334 Safari/7534.48.3`;
const regularAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3)
    AppleWebKit/537.36 (KHTML, like Gecko)
    Chrome/64.0.3282.186 Safari/537.36`;

@Component({
    template: `
        <auto-complete [id]="config.id"
            [autoSelect]="config.autoSelect"
            [options]="config.options"
            [allowCustom]="config.allowCustom">
        </auto-complete>
    `
})
class TestHostComponent {
    config: any = {
        autoSelect: false,
        options: [],
        required: true,
        defaultValue: '',
        id: 'foo',
        allowCustom: false,
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
    let navigatorInstance: NavigatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                NavigatorService
            ],
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

    describe('ngOnChanges lifecycle event', () => {
        const opts = ['foo', 'bar', 'baz'];
        it('should add options to state if provided', () => {
            spyOn(instanceUnderTest.state, 'setState');
            testHostInstance.configure({
                options: opts
            });
            testHostFixture.detectChanges();
            expect(instanceUnderTest.state.setState).toHaveBeenCalledWith({
                options: opts
            });
        });

        it('should not set the state if no options were provided', () => {
            spyOn(instanceUnderTest.state, 'setState');
            testHostInstance.configure({
                focused: null
            });
            testHostFixture.detectChanges();
            expect(instanceUnderTest.state.setState).not.toHaveBeenCalled();
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

    describe('handleComponentBlur handler', () => {
        const opts = ['foo', 'bar', 'baz'];
        it('should set a new state', () => {
            instanceUnderTest.state.setState({options: opts, selected: 0, query: 'foo'});
            spyOn(instanceUnderTest.state, 'setState');
            instanceUnderTest.handleComponentBlur({menuOpen: true});
            expect(instanceUnderTest.state.setState).toHaveBeenCalledWith({
                focused: null,
                selected: null,
                menuOpen: true,
                query: 'foo'
            });
        });

        it('should set the menuOpen state to false if not provided', () => {
            instanceUnderTest.state.setState({ options: opts, selected: 0, query: 'foo' });
            spyOn(instanceUnderTest.state, 'setState');
            instanceUnderTest.handleComponentBlur();
            expect(instanceUnderTest.state.setState).toHaveBeenCalledWith({
                focused: null,
                selected: null,
                menuOpen: false,
                query: 'foo'
            });
        });

        it('should allow custom values when the property is set', () => {
            testHostInstance.configure({allowCustom: true});
            instanceUnderTest.state.setState({ options: opts, selected: -1, query: 'hi' });
            testHostFixture.detectChanges();
            spyOn(instanceUnderTest, 'propagateChange');
            instanceUnderTest.handleComponentBlur();
            expect(instanceUnderTest.propagateChange).toHaveBeenCalledWith('hi');
        });

        it('should detect if query is in current options', () => {
            instanceUnderTest.state.setState({ options: opts, selected: -1, query: 'foo' });
            testHostFixture.detectChanges();
            spyOn(instanceUnderTest, 'propagateChange');
            instanceUnderTest.handleComponentBlur();
            expect(instanceUnderTest.propagateChange).toHaveBeenCalledWith('foo');
        });
    });

    describe('handleEnter handler', () => {
        const opts = ['foo', 'bar', 'baz'];
        it('should call preventDefault on the provided event if the menu is currently open', () => {
            const ev = { preventDefault: jasmine.createSpy('preventDefault') };
            instanceUnderTest.state.setState({options: opts, menuOpen: true});
            instanceUnderTest.handleEnter(ev);
            expect(ev.preventDefault).toHaveBeenCalled();
        });
        it('should NOT call preventDefault on the provided event if the menu is not open', () => {
            const ev = { preventDefault: jasmine.createSpy('preventDefault') };
            instanceUnderTest.state.setState({ options: opts, menuOpen: false });
            instanceUnderTest.handleEnter(ev);
            expect(ev.preventDefault).not.toHaveBeenCalled();
        });

        it('should call componentBlur if there is no selected option and the query is not in the options', () => {
            const ev = { preventDefault: jasmine.createSpy('preventDefault') };
            spyOn(instanceUnderTest, 'handleComponentBlur');
            instanceUnderTest.state.setState({ options: opts, menuOpen: true, query: 'hi', selected: -1 });
            instanceUnderTest.handleEnter(ev);
            expect(instanceUnderTest.handleComponentBlur).toHaveBeenCalledWith({
                focused: -1,
                selected: -1,
                menuOpen: false
            });
        });

        it('should call handleOptionClick if there is no selected option but the query is in the options', () => {
            const ev = { preventDefault: jasmine.createSpy('preventDefault') };
            spyOn(instanceUnderTest, 'handleOptionClick');
            instanceUnderTest.state.setState({ options: opts, menuOpen: true, query: 'foo', selected: -1 });
            instanceUnderTest.handleEnter(ev);
            expect(instanceUnderTest.handleOptionClick).toHaveBeenCalledWith(0);
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
            selected: -1,
            query: 'bar'
        };
        it('should set the state to menuOpen: false, focused to -1, selected to -1, and the query to the selected option', () => {
            spyOnProperty(instanceUnderTest.state, 'currentState', 'get').and.returnValue({
                matches: ['foo', 'bar'],
                options: ['foo', 'bar', 'baz'],
                query: 'bar'
            });
            spyOn(instanceUnderTest.state, 'setState');
            instanceUnderTest.handleOptionClick(1);
            expect(instanceUnderTest.state.setState).toHaveBeenCalledWith(expected);
        });

        it('should not call propagateChange if the selected option is not in the list of matches', () => {
            spyOnProperty(instanceUnderTest.state, 'currentState', 'get').and.returnValue({
                matches: ['foo', 'bar'],
                options: ['foo', 'bar', 'baz'],
                query: 'bar'
            });
            spyOn(instanceUnderTest, 'propagateChange');
            instanceUnderTest.handleOptionClick(4);
            expect(instanceUnderTest.propagateChange).not.toHaveBeenCalled();
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

    describe('queryOption getter', () => {
        it('should return the query if the query exists in the collection', () => {
            instanceUnderTest.state.setState({query: 'foo', options: ['foo', 'bar']});
            expect(instanceUnderTest.queryOption).toBe('foo');
        });
        it('should return null if the query does not in the collection', () => {
            instanceUnderTest.state.setState({ query: 'foo', options: ['bar', 'baz'] });
            expect(instanceUnderTest.queryOption).toBe(null);
        });
        it('should return null if the query is undefined/null', () => {
            instanceUnderTest.state.setState({ query: null, options: ['bar', 'baz'] });
            expect(instanceUnderTest.queryOption).toBe(null);
        });
        it('should return null if the options are undefined/null', () => {
            instanceUnderTest.state.setState({ query: 'foo', options: null });
            expect(instanceUnderTest.queryOption).toBe(null);
        });
        it('should return null if the options list is empty', () => {
            instanceUnderTest.state.setState({ query: 'foo', options: [] });
            expect(instanceUnderTest.queryOption).toBe(null);
        });
    });
});
