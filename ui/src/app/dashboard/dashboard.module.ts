import { NgModule } from '@angular/core';

import { I18nModule } from '../i18n/i18n.module';
import { CustomWidgetRegistry } from '../schema-form/registry';
import { WidgetRegistry } from 'ngx-schema-form';
import { DashboardPageComponent } from './container/dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing';
import { MetadataModule } from '../metadata/metadata.module';
import { AdminModule } from '../admin/admin.module';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        DashboardRoutingModule,
        MetadataModule,
        AdminModule,
        I18nModule,
        CommonModule
    ],
    providers: [
        { provide: WidgetRegistry, useClass: CustomWidgetRegistry }
    ],
    declarations: [
        DashboardPageComponent
    ]
})
export class DashboardModule { }
