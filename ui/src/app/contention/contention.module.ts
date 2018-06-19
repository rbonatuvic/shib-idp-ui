import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from './reducer';
import { ContentionEffects } from './effect/contention.effect';
import { ContentionDialogComponent } from './component/contention-dialog.component';
import { ChangeItemComponent } from './component/change-item.component';
import { ContentionService } from './service/contention.service';
import { SharedModule } from '../shared/shared.module';

export const COMPONENTS = [
    ContentionDialogComponent,
    ChangeItemComponent
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
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
