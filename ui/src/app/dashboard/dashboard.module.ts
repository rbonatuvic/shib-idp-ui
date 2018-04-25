import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap/pagination/pagination.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { DashboardComponent } from './container/dashboard.component';
import { EntityItemComponent } from './component/entity-item.component';
import { ProviderSearchComponent } from './component/provider-search.component';
import { reducers } from './reducer';
import { SearchEffects } from './effect/search.effects';
import { DeleteDialogComponent } from './component/delete-dialog.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PreviewDialogModule } from '../shared/preview/preview-dialog.module';

@NgModule({
    declarations: [
        DashboardComponent,
        EntityItemComponent,
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
        EffectsModule.forFeature([SearchEffects]),
        CommonModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        NgbModalModule,
        NgbDropdownModule,
        PreviewDialogModule,
        HttpClientModule
    ],
    providers: []
})
export class DashboardModule { }
