import { NgModule } from '@angular/core';

import { ResolverModule } from './resolver/resolver.module';
import { FilterModule } from './filter/filter.module';
import { DomainModule } from './domain/domain.module';
import { MetadataPageComponent } from './metadata.component';
import { ManagerModule } from './manager/manager.module';
import { MetadataRoutingModule } from './metadata.routing';
import { ProviderModule } from './provider/provider.module';
import { I18nModule } from '../i18n/i18n.module';
import { CustomWidgetRegistry } from '../schema-form/registry';
import { WidgetRegistry, SchemaValidatorFactory } from 'ngx-schema-form';
import { CustomSchemaValidatorFactory } from '../schema-form/service/schema-validator';
import { MetadataVersionModule } from './version/version.module';


@NgModule({
    imports: [
        ResolverModule.forRoot(),
        FilterModule.forRoot(),
        DomainModule.forRoot(),
        ManagerModule.forRoot(),
        ProviderModule.forRoot(),
        MetadataVersionModule.forRoot(),
        MetadataRoutingModule,
        I18nModule
    ],
    providers: [
        { provide: WidgetRegistry, useClass: CustomWidgetRegistry },
        {
            provide: SchemaValidatorFactory,
            useClass: CustomSchemaValidatorFactory
        }
    ],
    declarations: [
        MetadataPageComponent
    ]
})
export class MetadataModule { }
