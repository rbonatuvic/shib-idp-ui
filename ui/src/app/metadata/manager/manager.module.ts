import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap/pagination/pagination.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ManagerComponent } from './container/manager.component';
import { EntityItemComponent } from './component/entity-item.component';
import { ProviderSearchComponent } from './component/provider-search.component';
import { reducers } from './reducer';
import { SearchEffects } from './effect/search.effects';
import { DeleteDialogComponent } from './component/delete-dialog.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        ManagerComponent,
        EntityItemComponent,
        ProviderSearchComponent,
        DeleteDialogComponent
    ],
    entryComponents: [
        DeleteDialogComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: 'manager', component: ManagerComponent }
        ]),
        StoreModule.forFeature('manager', reducers),
        EffectsModule.forFeature([SearchEffects]),
        CommonModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        NgbModalModule,
        NgbDropdownModule,
        HttpClientModule
    ],
    providers: []
})
export class DashboardModule { }
