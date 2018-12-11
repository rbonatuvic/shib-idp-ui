import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user.routing';
import { I18nModule } from '../i18n/i18n.module';
import { CustomWidgetRegistry } from '../schema-form/registry';
import { WidgetRegistry } from 'ngx-schema-form';
import { UserPageComponent } from './user.component';
import { UserAdminModule } from './admin/admin.module';
import { CommonModule } from '@angular/common';


@NgModule({
    imports: [
        UserRoutingModule,
        UserAdminModule.forRoot(),
        CommonModule,
        I18nModule
    ],
    providers: [
        { provide: WidgetRegistry, useClass: CustomWidgetRegistry }
    ],
    declarations: [
        UserPageComponent
    ]
})
export class UserModule { }
