import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';

import { reducers } from './reducer';
import { ContentionEffects } from './effect/contention.effect';
import { ContentionDialogComponent } from './component/contention-dialog.component';
import { ChangeItemComponent } from './component/change-item.component';
import { DomainModule } from '../domain/domain.module';
import { ContentionService } from './service/contention.service';

export const COMPONENTS = [
    ContentionDialogComponent,
    ChangeItemComponent
];

@NgModule({
    imports: [
        CommonModule,
        DomainModule,
        StoreModule.forFeature('contention', reducers),
        EffectsModule.forFeature([ContentionEffects])
    ],
    providers: [
        ContentionService
    ],
    declarations: COMPONENTS,
    entryComponents: COMPONENTS,
    exports: COMPONENTS,
})
export class ContentionModule {}
