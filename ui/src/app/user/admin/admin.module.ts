import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { I18nModule } from '../../i18n/i18n.module';
import { AdminManagementPageComponent } from './container/admin-management.component';
import { AdminComponent } from './admin.component';

@NgModule({
    declarations: [
        AdminManagementPageComponent,
        AdminComponent
    ],
    entryComponents: [
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        SharedModule,
        I18nModule
    ]
})
export class UserAdminModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootUserAdminModule,
            providers: []
        };
    }
}

@NgModule({
    imports: [
        UserAdminModule,
        // StoreModule.forFeature('admin', reducers),
        // EffectsModule.forFeature([]),
    ],
})
export class RootUserAdminModule { }
