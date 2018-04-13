import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NewFilterComponent } from './container/new-filter.component';
import { reducers } from './reducer';
import { ProviderFormFragmentComponent } from '../metadata-provider/component/forms/provider-form-fragment.component';
import { ProviderEditorFormModule } from '../metadata-provider/component';
import { FilterEffects } from './effect/filter.effect';
import { NgbPopoverModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchDialogComponent } from './component/search-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { PreviewFilterComponent } from './component/preview-filter.component';
import { EditFilterComponent } from './container/edit-filter.component';
import { FilterComponent } from './container/filter.component';
import { SearchIdEffects } from './effect/search.effect';
import { FilterExistsGuard } from '../domain/guard/filter-exists.guard';

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
        SearchDialogComponent,
        PreviewFilterComponent
    ],
    entryComponents: [
        SearchDialogComponent,
        PreviewFilterComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        StoreModule.forFeature('metadata-filter', reducers),
        EffectsModule.forFeature([FilterEffects, SearchIdEffects]),
        RouterModule.forChild(routes),
        ProviderEditorFormModule,
        NgbPopoverModule,
        NgbModalModule,
        SharedModule
    ],
    providers: [
        FilterExistsGuard
    ]
})
export class FilterModule { }
