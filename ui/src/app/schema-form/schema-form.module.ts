import { NgModule } from '@angular/core';
import { SchemaFormModule } from 'ngx-schema-form';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { BooleanRadioComponent } from './widget/boolean-radio/boolean-radio.component';
import { SchemaService } from './service/schema.service';
import { FieldsetComponent } from './widget/fieldset/fieldset.component';
import { CustomStringComponent } from './widget/text/string.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { CustomSelectComponent } from './widget/select/select.component';
import { DatalistComponent } from './widget/datalist/datalist.component';
import { CustomCheckboxComponent } from './widget/check/checkbox.component';
import { CustomTextAreaComponent } from './widget/textarea/textarea.component';
import { CustomArrayComponent } from './widget/array/array.component';

export const COMPONENTS = [
    BooleanRadioComponent,
    FieldsetComponent,
    CustomStringComponent,
    CustomSelectComponent,
    DatalistComponent,
    CustomCheckboxComponent,
    CustomTextAreaComponent,
    CustomArrayComponent
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbPopoverModule,
        SharedModule,
        SchemaFormModule.forRoot()
    ],
    declarations: COMPONENTS,
    entryComponents: COMPONENTS,
    exports: [
        ...COMPONENTS,
        SchemaFormModule
    ],
})
export class FormModule {
    static forRoot() {
        return {
            ngModule: RootFormModule,
            providers: [
                SchemaService
            ]
        };
    }
}

@NgModule({
    imports: [],
})
export class RootFormModule { }
