import {
    Directive,
    ElementRef,
    Renderer2,
    HostListener,
    forwardRef,
    Input,
    OnInit
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    selector: '[contenteditable]',
    providers:
        [
            { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ContenteditableDirective), multi: true }
        ]
})
export class ContenteditableDirective implements ControlValueAccessor {
    @Input() propValueAccessor = 'textContent';

    private removeDisabledState: () => void;

    private propagateChange = (_: any | null) => { };
    private propagateTouched = (_: any | null) => { };

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    @HostListener('input')
    callOnChange() {
        this.propagateChange(this.elementRef.nativeElement[this.propValueAccessor]);
    }

    @HostListener('blur')
    callOnTouched() {
        this.propagateTouched(null);
    }
    writeValue(value: any): void {
        const normalizedValue = value || '';
        this.renderer.setProperty(this.elementRef.nativeElement, this.propValueAccessor, normalizedValue);
    }
    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.propagateTouched = fn;
    }
    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'true');
            this.removeDisabledState = this.renderer.listen(this.elementRef.nativeElement, 'keydown', this.listenerDisabledState);
        } else {
            if (this.removeDisabledState) {
                this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled');
                this.removeDisabledState();
            }
        }
    }

    private listenerDisabledState(e: KeyboardEvent) {
        e.preventDefault();
    }
}
