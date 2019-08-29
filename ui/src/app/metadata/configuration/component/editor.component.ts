import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Metadata } from '../../domain/domain.type';


@Component({
    selector: 'metadata-editor',
    templateUrl: './editor.component.html',
    styleUrls: []
})
export class MetadataEditorComponent {

    @Input() schema: any;
    @Input() bindings: any;
    @Input() validators: { [key: string]: any };
    @Input() model: Metadata;
    @Input() lockable: boolean;

    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() status: EventEmitter<any> = new EventEmitter();
    @Output() onLockChange: EventEmitter<any> = new EventEmitter();

    lock: FormControl = new FormControl(true);

    constructor() {
        this.lock.valueChanges.subscribe(locked => this.onLockChange.emit(locked));
    }
}

