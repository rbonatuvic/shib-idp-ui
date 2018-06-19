import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightPipe } from './pipe/highlight.pipe';
import { AutoCompleteComponent } from './autocomplete/autocomplete.component';
import { ValidationClassDirective } from './validation/validation-class.directive';
import { InputDefaultsDirective } from './directive/input-defaults.directive';
import { I18nTextComponent } from './component/i18n-text.component';
import { ValidFormIconComponent } from './component/valid-form-icon.component';

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
        InputDefaultsDirective,
        I18nTextComponent,
        ValidFormIconComponent
    ],
    exports: [
        HighlightPipe,
        AutoCompleteComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        InputDefaultsDirective,
        I18nTextComponent,
        ValidFormIconComponent
    ]
})
export class SharedModule { }
