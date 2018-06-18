import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightPipe } from './pipe/highlight.pipe';
import { AutoCompleteComponent } from './autocomplete/autocomplete.component';
import { ValidationClassDirective } from './validation/validation-class.directive';
import { InputDefaultsDirective } from './directive/input-defaults.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        HighlightPipe,
        AutoCompleteComponent,
        ValidationClassDirective,
        InputDefaultsDirective
    ],
    exports: [
        HighlightPipe,
        AutoCompleteComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        InputDefaultsDirective
    ]
})
export class SharedModule { }
