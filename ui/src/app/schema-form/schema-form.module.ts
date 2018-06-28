import { NgModule } from '@angular/core';
import { SchemaFormModule } from 'ngx-schema-form';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { BooleanRadioComponent } from './widget/boolean-radio/boolean-radio.component';
import { SchemaService } from './service/schema.service';
import { FieldsetComponent } from './widget/fieldset/fieldset.component';
import { CustomStringComponent } from './widget/text/string.component';

export const COMPONENTS = [
    BooleanRadioComponent,
    FieldsetComponent,
    CustomStringComponent
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
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
