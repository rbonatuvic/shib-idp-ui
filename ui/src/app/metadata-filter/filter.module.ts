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

export const routes: Routes = [
    {
        path: 'new',
        component: NewFilterComponent,
        canActivate: []
    }
];

@NgModule({
    declarations: [
        NewFilterComponent
    ],
    entryComponents: [],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        StoreModule.forFeature('metadata-filter', reducers),
        EffectsModule.forFeature([FilterEffects]),
        RouterModule.forChild(routes),
        ProviderEditorFormModule
    ],
    providers: []
})
export class FilterModule { }
