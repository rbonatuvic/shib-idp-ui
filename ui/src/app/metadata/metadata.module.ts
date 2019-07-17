import { NgModule } from '@angular/core';
import { Store } from '@ngrx/store';

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
import { MetadataConfigurationModule } from './configuration/configuration.module';
import { NavigationService } from '../core/service/navigation.service';
import { MetadataResolver } from './domain/model';
import { AddDraftRequest } from './resolver/action/draft.action';
import * as fromResolver from './resolver/reducer';
import * as fromProvider from './provider/reducer';
import { Router } from '@angular/router';

@NgModule({
    imports: [
        ResolverModule.forRoot(),
        FilterModule.forRoot(),
        DomainModule.forRoot(),
        ManagerModule.forRoot(),
        ProviderModule.forRoot(),
        MetadataConfigurationModule.forRoot(),
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
export class MetadataModule {
    constructor(
        private navService: NavigationService,
        private store: Store<fromResolver.State>,
        private router: Router
    ) {
        this.navService.addAction('add-md-source', {
            content: 'label.metadata-source',
            label: 'action.add-new-source',
            action: (event) => {
                event.preventDefault();
                const resolver = <MetadataResolver>{
                    id: `r-${Date.now()}`
                };
                this.store.dispatch(new AddDraftRequest(resolver));
                this.router.navigate(['/metadata', 'resolver', 'new'], {queryParams: { id: resolver.id}});
            },
            category: 'metadata',
            icon: 'fa-cube'
        });

        this.navService.addAction('add-md-provider', {
            content: 'label.metadata-provider',
            label: 'action.add-new-provider',
            action: (event) => {
                event.preventDefault();
                this.router.navigate(['/metadata', 'provider', 'wizard']);
            },
            category: 'metadata',
            icon: 'fa-cubes'
        });
    }
}
