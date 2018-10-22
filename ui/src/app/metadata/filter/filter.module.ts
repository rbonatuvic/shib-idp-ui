import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NewFilterComponent } from './container/new-filter.component';
import { reducers } from './reducer';
import { FilterEffects } from './effect/filter.effect';
import { NgbPopoverModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchDialogComponent } from './component/search-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { EditFilterComponent } from './container/edit-filter.component';
import { FilterComponent } from './container/filter.component';
import { SearchIdEffects } from './effect/search.effect';
import { FilterExistsGuard } from './guard/filter-exists.guard';
import { DomainModule } from '../domain/domain.module';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { FilterCollectionEffects } from './effect/collection.effect';
import { FormModule } from '../../schema-form/schema-form.module';
import { I18nModule } from '../../i18n/i18n.module';

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
        CommonModule,
        ReactiveFormsModule,
        NgbPopoverModule,
        NgbModalModule,
        SharedModule,
        DomainModule,
        HttpClientModule,
        RouterModule,
        FormModule,
        I18nModule
    ]
})
export class FilterModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootFilterModule,
            providers: [
                FilterExistsGuard
            ]
        };
    }
}

@NgModule({
    imports: [
        FilterModule,
        StoreModule.forFeature('filter', reducers),
        EffectsModule.forFeature([FilterEffects, SearchIdEffects, FilterCollectionEffects]),
    ],
})
export class RootFilterModule { }
