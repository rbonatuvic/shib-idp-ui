import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightPipe } from './pipe/highlight.pipe';
import { AutoCompleteComponent } from './autocomplete/autocomplete.component';
import { ValidationClassDirective } from './validation/validation-class.directive';
import { InputDefaultsDirective } from './directive/input-defaults.directive';
import { ValidFormIconComponent } from './component/valid-form-icon.component';
import { PrettyXml } from './pipe/pretty-xml.pipe';
import { ToggleSwitchComponent } from './switch/switch.component';
import { ContenteditableDirective } from './contenteditable/contenteditable.directive';
import { I18nModule } from '../i18n/i18n.module';
import { CustomDatePipe } from './pipe/date.pipe';
import { InfoIconComponent } from './component/info-icon.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        I18nModule,
        NgbPopoverModule
    ],
    declarations: [
        HighlightPipe,
        AutoCompleteComponent,
        ToggleSwitchComponent,
        ValidationClassDirective,
        InputDefaultsDirective,
        ValidFormIconComponent,
        PrettyXml,
        CustomDatePipe,
        ContenteditableDirective,
        InfoIconComponent
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
        ContenteditableDirective,
        CustomDatePipe,
        InfoIconComponent
    ]
})
export class SharedModule { }
