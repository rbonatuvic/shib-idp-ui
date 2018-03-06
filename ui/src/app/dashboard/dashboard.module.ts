import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap/pagination/pagination.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { DashboardComponent } from './container/dashboard.component';
import { ProviderItemComponent } from './component/provider-item.component';
import { ProviderSearchComponent } from './component/provider-search.component';
import { reducers } from './reducer';
import { DashboardEffects } from './effect/dashboard.effect';
import { SearchEffects } from './effect/search.effects';
import { DeleteDialogComponent } from './component/delete-dialog.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';

@NgModule({
    declarations: [
        DashboardComponent,
        ProviderItemComponent,
        ProviderSearchComponent,
        DeleteDialogComponent
    ],
    entryComponents: [
        DeleteDialogComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: '', component: DashboardComponent }
        ]),
        StoreModule.forFeature('dashboard', reducers),
        EffectsModule.forFeature([DashboardEffects, SearchEffects]),
        CommonModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        NgbModalModule
    ],
    providers: []
})
export class DashboardModule { }
