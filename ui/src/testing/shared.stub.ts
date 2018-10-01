import { Component, Input, NgModule, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'info-icon',
    template: '{{ description }}'
})
export class MockIconComponent {
    @Input() description: string;
}

@Component({
    selector: 'auto-complete',
    template: '<div></div>',
    styleUrls: [],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MockAutoCompleteComponent),
            multi: true
        }
    ]
})
export class MockAutoCompleteComponent implements ControlValueAccessor {
    @Input() defaultValue = '';
    @Input() matches: string[] = [];
    @Input() id: string;
    @Input() fieldId: string;
    @Input() autoSelect = false;
    @Input() noneFoundText = 'No Options Found';
    @Input() limit = 0;
    @Input() processing = false;
    @Input() dropdown = false;
    @Input() placeholder = '';

    @Output() more: EventEmitter<any> = new EventEmitter<any>();
    @Output() onChange: EventEmitter<string> = new EventEmitter<string>();

    propagateChange = (_: any | null) => { };
    propagateTouched = (_: any | null) => { };

    constructor() { }

    writeValue(value: any): void {}

    registerOnChange(fn: any): void {}

    registerOnTouched(fn: any): void {}

    setDisabledState(isDisabled: boolean = false): void {}
}

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        MockIconComponent,
        MockAutoCompleteComponent
    ],
    exports: [
        MockIconComponent,
        MockAutoCompleteComponent
    ],
    providers: []
})
export class MockSharedModule {}
