import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightPipe } from './pipe/highlight.pipe';
import { AutoCompleteComponent } from './autocomplete/autocomplete.component';
import { ValidationClassDirective } from './validation/validation-class.directive';
import { InputDefaultsDirective } from './directive/input-defaults.directive';
import { ValidFormIconComponent } from './component/valid-form-icon.component';
import { InfoLabelDirective } from './directive/info-label.directive';
import { PrettyXml } from './pipe/pretty-xml.pipe';
import { ToggleSwitchComponent } from './switch/switch.component';
import { ContenteditableDirective } from './contenteditable/contenteditable.directive';
import { ReplacePipe } from './pipe/replace.pipe';
import { I18nModule } from '../i18n/i18n.module';
import { CustomDatePipe } from './pipe/date.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        I18nModule
    ],
    declarations: [
        HighlightPipe,
        AutoCompleteComponent,
        ToggleSwitchComponent,
        ValidationClassDirective,
        InputDefaultsDirective,
        ValidFormIconComponent,
        InfoLabelDirective,
        PrettyXml,
        ReplacePipe,
        CustomDatePipe,
        ContenteditableDirective
    ],
    exports: [
        HighlightPipe,
        AutoCompleteComponent,
        ToggleSwitchComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        InputDefaultsDirective,
        ValidFormIconComponent,
        ValidationClassDirective,
        InfoLabelDirective,
        ContenteditableDirective,
        ReplacePipe,
        CustomDatePipe
    ]
})
export class SharedModule { }
