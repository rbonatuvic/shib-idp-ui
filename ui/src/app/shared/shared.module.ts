import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightPipe } from './pipe/highlight.pipe';
import { AutoCompleteComponent } from './autocomplete/autocomplete.component';
import { ValidationClassDirective } from './validation/validation-class.directive';
import { InputDefaultsDirective } from './directive/input-defaults.directive';
import { I18nTextComponent } from './component/i18n-text.component';
import { ValidFormIconComponent } from './component/valid-form-icon.component';
import { InfoLabelDirective } from './directive/info-label.directive';
import { PrettyXml } from './pipe/pretty-xml.pipe';
import { ToggleSwitchComponent } from './switch/switch.component';
import { ContenteditableDirective } from './contenteditable/contenteditable.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        HighlightPipe,
        AutoCompleteComponent,
        ToggleSwitchComponent,
        ValidationClassDirective,
        InputDefaultsDirective,
        I18nTextComponent,
        ValidFormIconComponent,
        InfoLabelDirective,
        PrettyXml,
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
        I18nTextComponent,
        ValidFormIconComponent,
        ValidationClassDirective,
        InfoLabelDirective,
        ContenteditableDirective
    ]
})
export class SharedModule { }
