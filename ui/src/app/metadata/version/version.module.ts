import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HistoryListComponent } from './component/history-list.component';
import { CommonModule } from '@angular/common';
import { VersionHistoryComponent } from './container/version-history.component';
import { HistoryService } from './service/history.service';
import { I18nModule } from '../../i18n/i18n.module';

@NgModule({
    declarations: [
        HistoryListComponent,
        VersionHistoryComponent
    ],
    entryComponents: [],
    imports: [
        CommonModule,
        I18nModule
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
