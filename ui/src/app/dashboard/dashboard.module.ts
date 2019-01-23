import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { I18nModule } from '../i18n/i18n.module';
import { CustomWidgetRegistry } from '../schema-form/registry';
import { WidgetRegistry } from 'ngx-schema-form';
import { DashboardPageComponent } from './container/dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing';
import { MetadataModule } from '../metadata/metadata.module';
import { UserModule } from '../user/user.module';


@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MetadataModule,
        UserModule,
        I18nModule
    ],
    providers: [
        { provide: WidgetRegistry, useClass: CustomWidgetRegistry }
    ],
    declarations: [
        DashboardPageComponent
    ]
})
export class DashboardModule { }
