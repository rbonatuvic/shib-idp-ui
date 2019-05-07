import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HistoryListComponent } from './component/history-list.component';
import { CommonModule } from '@angular/common';
import { VersionHistoryComponent } from './container/version-history.component';
import { HistoryService } from './service/history.service';

@NgModule({
    declarations: [
        HistoryListComponent,
        VersionHistoryComponent
    ],
    entryComponents: [],
    imports: [
        CommonModule
    ],
    exports: [],
    providers: []
})
export class MetadataVersionModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootMetadataVersionModule,
            providers: []
        };
    }
}

@NgModule({
    imports: [
        MetadataVersionModule,
        // StoreModule.forFeature('resolver', fromResolver.reducers),
        // EffectsModule.forFeature([])
    ],
    providers: [
        HistoryService
    ]
})
export class RootMetadataVersionModule { }
