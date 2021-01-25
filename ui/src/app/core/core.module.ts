import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { UserService } from './service/user.service';
import { CanDeactivateGuard } from './service/can-deactivate.guard';
import { FileService } from './service/file.service';

import { reducers } from './reducer';
import { VersionEffects } from './effect/version.effect';
import { UserEffects } from './effect/user.effect';
import { HttpClientModule } from '@angular/common/http';
import { ModalService } from './service/modal.service';
import { DifferentialService } from './service/differential.service';
import { NavigatorService } from './service/navigator.service';
import { NavigationService } from './service/navigation.service';
import { PageTitleComponent } from './component/page-title.component';

export const COMPONENTS = [
    PageTitleComponent
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule
    ],
    declarations: COMPONENTS,
    entryComponents: COMPONENTS,
    exports: COMPONENTS,
})
export class CoreModule {
    static forRoot(): ModuleWithProviders<RootCoreModule> {
    return {
        ngModule: RootCoreModule,
        providers: [
            UserService,
            FileService,
            ModalService,
            DifferentialService,
            CanDeactivateGuard,
            NavigatorService,
            NavigationService
        ]
    };
}
}

@NgModule({
    imports: [
        StoreModule.forFeature('core', reducers),
        EffectsModule.forFeature([UserEffects, VersionEffects]),
    ],
})
export class RootCoreModule { }
