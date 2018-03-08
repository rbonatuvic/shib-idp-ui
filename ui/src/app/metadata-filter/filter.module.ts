import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NewFilterComponent } from './container/new-filter.component';
import { reducers } from './reducer';

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
        EffectsModule.forFeature([]),
        RouterModule.forChild(routes)
    ],
    providers: []
})
export class FilterModule { }
