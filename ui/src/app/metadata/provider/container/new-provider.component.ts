import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'new-provider-page',
    templateUrl: './new-provider.component.html',
    styleUrls: ['./new-provider.component.scss']
})
export class NewProviderComponent {
    form: FormGroup = this.fb.group({
        name: ['', [Validators.required]],
        '@type': ['', [Validators.required]]
    });

    constructor(
        private fb: FormBuilder
    ) {}

    next(): void {}
}
