import { Component, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'provider-search',
    templateUrl: './provider-search.component.html'
})
export class ProviderSearchComponent implements OnChanges {
    @Input() query = '';
    @Input() searching = false;
    @Output() search = new EventEmitter<string>();

    searchForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.searchForm = this.fb.group({
            search: [this.query]
        });
    }

    ngOnChanges(): void {
        this.searchForm.setValue({
            search: this.query
        });
    }
} /* istanbul ignore next */
