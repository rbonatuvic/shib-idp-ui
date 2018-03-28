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

export const routes: Routes = [
    {
        path: 'new',
        component: NewFilterComponent,
        canActivate: []
    }
];

@NgModule({
    declarations: [
        NewFilterComponent,
        SearchDialogComponent
    ],
    entryComponents: [
        SearchDialogComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        StoreModule.forFeature('metadata-filter', reducers),
        EffectsModule.forFeature([FilterEffects]),
        RouterModule.forChild(routes),
        ProviderEditorFormModule,
        NgbPopoverModule,
        NgbModalModule,
        SharedModule
    ],
    providers: []
})
export class FilterModule { }
