import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { UserService } from './service/user.service';
import { CanDeactivateGuard } from './service/can-deactivate.guard';
import { FileService } from './service/file.service';

export const COMPONENTS = [];

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HttpModule
    ],
    declarations: COMPONENTS,
    entryComponents: COMPONENTS,
    exports: COMPONENTS,
})
export class CoreModule {
    static forRoot() {
        return {
            ngModule: CoreModule,
            providers: [
                UserService,
                FileService,
                CanDeactivateGuard
            ]
        };
    }
}
