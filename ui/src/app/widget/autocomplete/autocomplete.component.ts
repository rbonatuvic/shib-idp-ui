import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    OnChanges,
    AfterViewInit,
    ViewChild,
    ViewChildren,
    QueryList,
    ElementRef,
    SimpleChanges,
    forwardRef
} from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/combineLatest';

import { keyCodes, isPrintableKeyCode } from '../../shared/keycodes';
import { AutoCompleteState, AutoCompleteStateEmitter, defaultState } from './autocomplete.model';
import * as AutoCompleteValidators from './autocomplete-validators.service';
import { NavigatorService } from '../../core/service/navigator.service';

const POLL_TIMEOUT = 1000;
const MIN_LENGTH = 2;
const INPUT_FIELD_INDEX = -1;

@Component({
    selector: 'auto-complete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutoCompleteComponent),
            multi: true
        }
    ]
})
export class AutoCompleteComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit, ControlValueAccessor {
    @Input() required: boolean | null = true;
    @Input() defaultValue = '';
    @Input() options: string[] = [];
    @Input() id: string;
    @Input() autoSelect = false;
    @Input() allowCustom = false;
    @Input() noneFoundText = 'No Options Found';

    @Output() more: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('inputField') inputField: ElementRef;
    @ViewChildren('matchElement', { read: ElementRef }) listItems: QueryList<ElementRef>;

    focused: number;
    selected: number;
    disabled = false;

    isMenuOpen$: Observable<boolean>;
    query$: Observable<string>;

    $pollInput: Observable<number>;
    $checkInputValue: Observable<any>;
    $pollSubscription: Subscription;

    matches$: Observable<string[]>;
    numMatches: number;

    input: FormControl = new FormControl();
    elementReferences: {[id: number]: ElementRef} = {};
    state: AutoCompleteStateEmitter = new AutoCompleteStateEmitter();

    menuIsVisible$: Observable<boolean>;

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    propagateChange = (_: any | null) => { };
    propagateTouched = (_: any | null) => { };

    constructor(private navigator: NavigatorService) {}

    ngOnInit(): void {
        this.$pollInput = Observable.interval(POLL_TIMEOUT);
        this.$checkInputValue = this.$pollInput.takeUntil(this.ngUnsubscribe).combineLatest(this.input.valueChanges);
        this.$pollSubscription = this.$checkInputValue.subscribe(([polled, value]) => {
            const inputReference = this.inputField.nativeElement;
            const queryHasChanged = inputReference && inputReference.value !== value;
            if (queryHasChanged) {
                this.input.setValue(inputReference.value);
                this.input.updateValueAndValidity();
            }
        });

        this.input
            .valueChanges
            .subscribe((query) => {
                let matches = [];
                if (query && query.length >= MIN_LENGTH && this.state.currentState.options) {
                    matches = this.state.currentState.options
                        .filter((option: string) => option.toLocaleLowerCase().match(query.toLocaleLowerCase()));
                } else {
                    matches = [];
                }
                this.state.setState({ matches });
            });
        this.input.valueChanges.subscribe(newValue => this.handleInputChange(newValue));
        this.input.setValue(this.defaultValue);

        this.menuIsVisible$ = this.state.changes$.map(state => state.menuOpen);
    }

    ngOnDestroy(): void {
        this.$pollSubscription.unsubscribe();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    ngAfterViewInit(): void {
        this.listItems.changes.subscribe((changes) => this.setElementReferences(changes));
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.options) {
            this.state.setState({options: this.options});
        }
        this.setValidation(changes);
    }

    setValidation(changes: SimpleChanges): void {
        if (changes.required) {
            if (this.required) {
                this.input.setValidators([Validators.required]);
            } else {
                this.input.clearValidators();
            }
        }

        if (changes.disabled) {
            if (this.disabled) {
                this.input.disable();
            } else {
                this.input.enable();
            }
        }

        if (changes.allowCustom || changes.options) {
            if (!this.allowCustom) {
                let opts$ = Observable.of(this.options);
                this.input.setAsyncValidators([AutoCompleteValidators.existsInCollection(opts$)]);
            } else {
                this.input.clearAsyncValidators();
            }
        }
    }

    writeValue(value: any): void {
        this.input.setValue(value);
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.propagateTouched = fn;
    }

    setDisabledState(isDisabled: boolean = false): void {
        this.disabled = isDisabled;
    }

    setElementReferences(changes): void {
        this.elementReferences = {
            [INPUT_FIELD_INDEX]: this.inputField
        };
        this.listItems.map((item, index) => {
            this.elementReferences[index] = item;
        });
    }

    handleComponentBlur(newState: any = {}): void {
        let { selected, options, query } = this.state.currentState,
            change = options && options[selected] ? options[selected] : null;
        if (!change) {
            if (this.allowCustom) {
                change = query;
            } else {
                change = this.queryOption;
            }
        }
        this.propagateChange(change);
        this.propagateTouched(null);
        this.state.setState({
            focused: null,
            selected: null,
            menuOpen: newState.menuOpen || false,
            query
        });
    }

    handleOptionBlur(event: FocusEvent, index): void {
        const elm = event.relatedTarget as HTMLElement;
        const { focused, menuOpen, options, selected } = this.state.currentState;
        const focusingOutsideComponent = event.relatedTarget === null;
        const focusingInput = elm.id === this.elementReferences[-1].nativeElement.id;
        const focusingAnotherOption = focused !== index && focused !== -1;
        const blurComponent = (!focusingAnotherOption && focusingOutsideComponent) || !(focusingAnotherOption || focusingInput);
        if (blurComponent) {
            const keepMenuOpen = menuOpen && this.isIosDevice();
            this.handleComponentBlur({
                menuOpen: keepMenuOpen,
                query: options[selected]
            });
        }
    }

    handleInputBlur(event: FocusEvent): void {
        const { focused, menuOpen, options, query, selected } = this.state.currentState;
        const focusingAnOption = focused !== -1;
        const isIosDevice = this.isIosDevice();
        if (!focusingAnOption && options) {
            const keepMenuOpen = menuOpen && isIosDevice;
            const newQuery = isIosDevice ? query : options[selected];
            this.handleComponentBlur({
                menuOpen: keepMenuOpen,
                query: newQuery
            });
        } else {
            this.handleComponentBlur({
                menuOpen: false,
                query
            });
        }
    }

    handleInputChange(query: string): void {
        query = query || '';
        const queryEmpty = query.length === 0;
        const queryChanged = this.state.currentState.query.length !== query.length;
        const queryLongEnough = query.length >= MIN_LENGTH;
        const autoselect = this.hasAutoselect;
        const optionsAvailable = this.state.currentState.matches.length > 0;
        const searchForOptions = (!queryEmpty && queryChanged && queryLongEnough);
        this.state.setState({
            menuOpen: searchForOptions,
            selected: searchForOptions ? ((autoselect && optionsAvailable) ? 0 : -1) : null,
            query
        });
        if (this.allowCustom) {
            this.propagateChange(query);
        }
    }

    handleInputFocus(): void {
        this.state.setState({
            focused: INPUT_FIELD_INDEX
        });
    }
    handleOptionFocus(index: number) {
        this.state.setState({
            focused: index,
            selected: index
        });
    }
    handleOptionClick(index: number): void {
        let { matches, options } = this.state.currentState;
        const selectedOption = matches[index];
        if (selectedOption) {
            this.propagateChange(selectedOption);
        }
        this.input.setValue(selectedOption);
        this.state.setState({
            focused: -1,
            selected: -1,
            menuOpen: false,
            query: selectedOption
        });
    }

    handleKeyDown(event: KeyboardEvent): void {
        switch (keyCodes[event.keyCode]) {
            case 'up':
                this.handleUpArrow(event);
                break;
            case 'down':
                this.handleDownArrow(event);
                break;
            case 'space':
                this.handleSpace(event);
                break;
            case 'enter':
                this.handleEnter(event);
                break;
            case 'escape':
                this.handleComponentBlur();
                break;
        }
    }

    handleUpArrow(event: KeyboardEvent): void {
        event.preventDefault();
        const isNotAtTop = this.state.currentState.selected !== 0;
        const allowMoveUp = isNotAtTop && this.state.currentState.menuOpen;
        if (allowMoveUp) {
            this.handleOptionFocus(this.state.currentState.selected - 1);
        }
    }

    handleDownArrow(event: KeyboardEvent): void {
        event.preventDefault();
        const isNotAtBottom = this.state.currentState.selected !== this.state.currentState.matches.length - 1;
        const allowMoveDown = isNotAtBottom && this.state.currentState.menuOpen;
        if (allowMoveDown) {
            this.handleOptionFocus(this.state.currentState.selected + 1);
        }
    }

    handleSpace(event: KeyboardEvent): void {
        event.preventDefault();
        const focusIsOnOption = this.state.currentState.focused !== -1;
        if (focusIsOnOption) {
            this.handleOptionClick(this.state.currentState.focused);
        }
    }

    handleEnter(event: KeyboardEvent | { preventDefault: () => {} }): void {
        let { options, selected, query, menuOpen } = this.state.currentState;
        if (menuOpen) {
            event.preventDefault();
            let hasSelectedOption = selected >= 0;
            if (!hasSelectedOption) {
                const queryIndex = options.indexOf(query);
                hasSelectedOption = queryIndex > -1;
                selected = hasSelectedOption ? queryIndex : selected;
            }
            if (hasSelectedOption) {
                this.handleOptionClick(selected);
            } else {
                this.handleComponentBlur({
                    focused: -1,
                    selected: -1,
                    menuOpen: false
                });
            }
        }
    }

    handleOptionMouseDown(event: MouseEvent | { preventDefault: () => {} }): void {
        event.preventDefault();
    }

    handleOptionMouseEnter(index: number): void {
        this.state.setState({
            hovered: index
        });
    }

    handleOptionMouseOut(): void {
        this.state.setState({
            hovered: null
        });
    }

    isIosDevice() {
        let agent = this.navigator.native.userAgent;
        return !!(agent.match(/(iPod|iPhone|iPad)/g) && agent.match(/AppleWebKit/g));
    }

    get queryOption(): string | null {
        const { query, options } = this.state.currentState;
        const hasQueryAndOptions = query && options && options.length;
        return hasQueryAndOptions ? options.indexOf(query) > -1 ? query : null : null;
    }

    get hasAutoselect(): boolean {
        return this.isIosDevice() ? false : this.autoSelect;
    }

    get activeDescendant (): string {
        let state = this.state.currentState,
            focused = state.focused,
            optionFocused = focused !== -1 && focused !== null;
        return optionFocused ? `${ this.id }__option--${ focused }` : 'false';
    }

    get displayState(): any {
        return {
            ...this.state.currentState,
            options: []
        };
    }
} /* istanbul ignore next */
