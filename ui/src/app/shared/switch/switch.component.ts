import { Component, Input, forwardRef, HostBinding, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'toggle-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ToggleSwitchComponent),
            multi: true
        }
    ]
})

export class ToggleSwitchComponent implements ControlValueAccessor {
    checked = false;

    @Input() disabled = false;
    @HostBinding('style.opacity')
    get opacity() {
        return this.disabled ? 0.25 : 1;
    }

    onChange = (checked: boolean) => { };

    onTouched = () => { };

    get value(): boolean {
        return this.checked;
    }

    writeValue(checked: boolean): void {
        this.checked = checked;
    }
    registerOnChange(fn: (checked: boolean) => void): void {
        this.onChange = fn;
        this.onChange(this.checked);
    }
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}

