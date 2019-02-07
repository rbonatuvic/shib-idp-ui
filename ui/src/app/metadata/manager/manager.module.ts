import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ManagerComponent } from './container/manager.component';
import { EntityItemComponent } from './component/entity-item.component';
import { ProviderItemComponent } from './component/provider-item.component';
import { ResolverItemComponent } from './component/resolver-item.component';
import { ProviderSearchComponent } from './component/provider-search.component';
import { DashboardResolversListComponent } from './container/dashboard-resolvers-list.component';
import { DashboardProvidersListComponent } from './container/dashboard-providers-list.component';
import { reducers } from './reducer';
import { SearchEffects } from './effect/search.effects';
import { DeleteDialogComponent } from './component/delete-dialog.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { I18nModule } from '../../i18n/i18n.module';

@NgModule({
    declarations: [
        ManagerComponent,
        EntityItemComponent,
        ResolverItemComponent,
        ProviderItemComponent,
        ProviderSearchComponent,
        DeleteDialogComponent,
        DashboardResolversListComponent,
        DashboardProvidersListComponent
    ],
    entryComponents: [
        DeleteDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        RouterModule,
        NgbModalModule,
        NgbDropdownModule,
        HttpClientModule,
        SharedModule,
        I18nModule
    ],
    exports: [
        ResolverItemComponent
    ]
})
export class ManagerModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootManagerModule,
            providers: []
        };
    }
}

@NgModule({
    imports: [
        ManagerModule,
        StoreModule.forFeature('manager', reducers),
        EffectsModule.forFeature([SearchEffects]),
    ],
})
export class RootManagerModule { }
