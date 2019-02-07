import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import { I18nModule } from '../i18n/i18n.module';
import { AdminManagementPageComponent } from './container/admin-management.component';
import { AdminComponent } from './admin.component';
import { reducers } from './reducer';
import { AdminService } from './service/admin.service';
import { AdminCollectionEffects } from './effect/admin-collection.effect';
import { EffectsModule } from '@ngrx/effects';
import { DeleteUserDialogComponent } from './component/delete-user-dialog.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionRequiredPageComponent } from './container/action-required.component';
import { AccessRequestComponent } from './component/access-request.component';
import { UserManagementComponent } from './component/user-management.component';
import { EnableMetadataComponent } from './component/enable-metadata.component';
import { ManagerModule } from '../metadata/manager/manager.module';
import { MetadataCollectionEffects } from './effect/metadata-collection.effect';

@NgModule({
    declarations: [
        AdminManagementPageComponent,
        AdminComponent,
        DeleteUserDialogComponent,
        UserManagementComponent,
        ActionRequiredPageComponent,
        AccessRequestComponent,
        EnableMetadataComponent
    ],
    entryComponents: [
        DeleteUserDialogComponent
    ],
    imports: [
        CommonModule,
        I18nModule,
        StoreModule.forFeature('admin', reducers),
        EffectsModule.forFeature([AdminCollectionEffects, MetadataCollectionEffects]),
        FormsModule,
        RouterModule,
        HttpClientModule,
        SharedModule,
        I18nModule,
        NgbModalModule,
        ManagerModule
    ],
    providers: [
        AdminService
    ]
})
export class AdminModule { }
