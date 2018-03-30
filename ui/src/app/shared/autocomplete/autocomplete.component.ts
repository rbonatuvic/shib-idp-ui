import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ViewChild,
    ViewChildren,
    QueryList,
    ElementRef,
    SimpleChanges,
    forwardRef,
    ChangeDetectionStrategy,
    OnChanges
} from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/combineLatest';

import { keyCodes, isPrintableKeyCode } from '../../shared/keycodes';
import { AutoCompleteState, AutoCompleteStateEmitter, defaultState } from './autocomplete.model';
import { NavigatorService } from '../../core/service/navigator.service';

const POLL_TIMEOUT = 1000;
const INPUT_FIELD_INDEX = -1;

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    @Input() defaultValue = '';
    @Input() matches: string[] = [];
    @Input() id: string;
    @Input() autoSelect = false;
    @Input() noneFoundText = 'No Options Found';
    @Input() showMoreText = 'Show More...';
    @Input() limit = 0;
    @Input() processing = false;

    @Output() more: EventEmitter<any> = new EventEmitter<any>();
    @Output() onChange: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('inputField') inputField: ElementRef;
    @ViewChildren('matchElement', { read: ElementRef }) listItems: QueryList<ElementRef>;

    focused: number;
    selected: number;

    isMenuOpen$: Observable<boolean>;
    query$: Observable<string>;

    $pollInput: Observable<number>;
    $checkInputValue: Observable<any>;
    $pollSubscription: Subscription;

    showMoreAvailable: boolean;

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

        this.input.valueChanges.subscribe(query => this.onChange.emit(query));
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
        if (changes.matches) {
            this.showMoreAvailable = !!this.limit && this.matches && this.matches.length >= this.limit;
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
        if (isDisabled) {
            this.input.disable();
        } else {
            this.input.enable();
        }
    }

    setElementReferences(changes): void {
        this.elementReferences = {
            [INPUT_FIELD_INDEX]: this.inputField
        };
        this.listItems.map((item, index) => {
            this.elementReferences[index] = item;
        });
    }

    handleViewMore($event: MouseEvent | KeyboardEvent | Event): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.handleInputBlur();
        this.input.markAsTouched();
        this.more.emit(this.input.value);
    }

    handleComponentBlur(newState: any = {}): void {
        let { selected } = this.state.currentState,
            query = this.input.value,
            change = this.matches && this.matches[selected] ? this.matches[selected] : query;
        this.propagateChange(change);
        this.propagateTouched(null);
        this.state.setState({
            focused: null,
            selected: null,
            menuOpen: newState.menuOpen || false
        });
    }

    handleOptionBlur(event: FocusEvent, index): void {
        const elm = event.relatedTarget as HTMLElement;
        const { focused, menuOpen, selected } = this.state.currentState;
        const focusingOutsideComponent = event.relatedTarget === null;
        const focusingInput = elm.id === this.elementReferences[-1].nativeElement.id;
        const focusingAnotherOption = focused !== index && focused !== -1;
        const blurComponent = (!focusingAnotherOption && focusingOutsideComponent) || !(focusingAnotherOption || focusingInput);
        if (blurComponent) {
            const keepMenuOpen = menuOpen && this.isIosDevice();
            this.handleComponentBlur({
                menuOpen: keepMenuOpen,
                query: this.matches[selected]
            });
        }
    }

    handleInputBlur(): void {
        const { focused, menuOpen, selected } = this.state.currentState;
        const query = this.input.value;
        const focusingAnOption = focused !== -1;
        const isIosDevice = this.isIosDevice();
        if (!focusingAnOption && this.matches) {
            const keepMenuOpen = menuOpen && isIosDevice;
            const newQuery = isIosDevice ? query : this.matches[selected];
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
        const autoselect = this.hasAutoselect;
        const optionsAvailable = this.matches.length > 0;
        const searchForOptions = !queryEmpty;
        this.state.setState({
            menuOpen: searchForOptions && !this.matches.some(m => m === query),
            selected: searchForOptions ? ((autoselect && optionsAvailable) ? 0 : -1) : null
        });
        this.propagateChange(query);
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
        const selectedOption = this.matches[index];
        this.propagateChange(selectedOption);
        this.input.setValue(selectedOption);
        this.state.setState({
            focused: -1,
            selected: -1,
            menuOpen: false
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
        let isNotAtBottom = this.state.currentState.selected !== this.matches.length - 1;
        if (this.showMoreAvailable) {
            isNotAtBottom = this.state.currentState.selected !== this.matches.length;
        }
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

    handleEnter(event: KeyboardEvent): void {
        let { selected, menuOpen } = this.state.currentState,
            query = this.input.value;
        if (menuOpen) {
            event.preventDefault();
            let hasSelectedOption = selected >= 0;
            if (!hasSelectedOption) {
                const queryIndex = this.matches.indexOf(query);
                hasSelectedOption = queryIndex > -1;
                selected = hasSelectedOption ? queryIndex : selected;
            }
            if (hasSelectedOption && selected < this.matches.length) {
                this.handleOptionClick(selected);
            } else if (hasSelectedOption && selected === this.matches.length) {
                this.handleViewMore(event as KeyboardEvent);
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

    getOptionId(index): string {
        return `${this.id}__option--${index}`;
    }

    get hasAutoselect(): boolean {
        return this.isIosDevice() ? false : this.autoSelect;
    }

    get activeDescendant (): string {
        let { focused } = this.state.currentState,
            optionFocused = focused !== -1 && focused !== null;
        return optionFocused ? this.getOptionId(focused) : null;
    }

    get displayState(): any {
        return {
            ...this.state.currentState
        };
    }
} /* istanbul ignore next */
