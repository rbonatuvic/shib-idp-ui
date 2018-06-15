import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NewFilterComponent } from './container/new-filter.component';
import { reducers } from './reducer';
import { ProviderEditorFormModule } from '../domain/component';
import { FilterEffects } from './effect/filter.effect';
import { NgbPopoverModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchDialogComponent } from './component/search-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { EditFilterComponent } from './container/edit-filter.component';
import { FilterComponent } from './container/filter.component';
import { SearchIdEffects } from './effect/search.effect';
import { FilterExistsGuard } from './guard/filter-exists.guard';
import { DomainModule } from '../domain/domain.module';


export const routes: Routes = [
    {
        path: 'new',
        component: NewFilterComponent,
        canActivate: []
    },
    {
        path: ':id',
        component: FilterComponent,
        canActivate: [FilterExistsGuard],
        children: [
            {
                path: 'edit',
                component: EditFilterComponent,
                canDeactivate: []
            }
        ]
    }
];

@NgModule({
    declarations: [
        NewFilterComponent,
        EditFilterComponent,
        FilterComponent,
        SearchDialogComponent
    ],
    entryComponents: [
        SearchDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        StoreModule.forFeature('metadata-filter', reducers),
        EffectsModule.forFeature([FilterEffects, SearchIdEffects]),
        CommonModule,
        ReactiveFormsModule,
        ProviderEditorFormModule,
        NgbPopoverModule,
        NgbModalModule,
        SharedModule,
        DomainModule,
        HttpClientModule
    ],
    providers: [
        FilterExistsGuard
    ]
})
export class FilterModule { }
