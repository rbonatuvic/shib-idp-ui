import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../../shared/shared.module';
import { I18nModule } from '../../i18n/i18n.module';
import { AdminManagementPageComponent } from './container/admin-management.component';
import { AdminComponent } from './admin.component';
import { reducers } from './reducer';
import { AdminService } from './service/admin.service';
import { AdminCollectionEffects } from './effect/collection.effect';
import { EffectsModule } from '@ngrx/effects';
import { DeleteUserDialogComponent } from './component/delete-user-dialog.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        AdminManagementPageComponent,
        AdminComponent,
        DeleteUserDialogComponent
    ],
    entryComponents: [
        DeleteUserDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        HttpClientModule,
        SharedModule,
        I18nModule,
        NgbModalModule
    ]
})
export class UserAdminModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootUserAdminModule,
            providers: [
                AdminService
            ]
        };
    }
}

@NgModule({
    imports: [
        UserAdminModule,
        StoreModule.forFeature('admin', reducers),
        EffectsModule.forFeature([AdminCollectionEffects]),
    ],
})
export class RootUserAdminModule { }
