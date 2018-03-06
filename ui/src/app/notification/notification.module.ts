import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { reducers } from './reducer';
import { NotificationListComponent } from './component/notification-list.component';
import { NotificationItemComponent } from './component/notification-item.component';

const COMPONENTS = [
    NotificationListComponent,
    NotificationItemComponent
];

@NgModule({
    declarations: COMPONENTS,
    entryComponents: COMPONENTS,
    imports: [
        CommonModule,
        StoreModule.forFeature('notifications', reducers)
    ],
    exports: COMPONENTS,
    providers: []
})
export class NotificationModule {}

