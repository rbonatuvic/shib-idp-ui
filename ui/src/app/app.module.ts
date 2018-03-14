import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgbDropdownModule, NgbModalModule, NgbPopoverModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { MetadataProviderModule } from './metadata-provider/metadata-provider.module';
import { reducers } from './core/reducer';
import { CustomRouterStateSerializer } from './shared/util';

import { UserEffects } from './core/effect/user.effect';
import { CachingInterceptor } from './core/service/cache.interceptor';
import { AuthorizedInterceptor } from './core/service/authorized.interceptor';
import { NotificationModule } from './notification/notification.module';
import { ErrorInterceptor } from './core/service/error.interceptor';
import { NavigatorService } from './core/service/navigator.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        StoreModule.forRoot({
            ...reducers
        }),
        EffectsModule.forRoot([
            UserEffects
        ]),
        BrowserModule,
        AppRoutingModule,
        CoreModule.forRoot(),
        MetadataProviderModule.forRoot(),
        StoreRouterConnectingModule,
        NgbDropdownModule.forRoot(),
        NgbModalModule.forRoot(),
        NgbPopoverModule.forRoot(),
        NgbPaginationModule.forRoot(),
        NotificationModule
    ],
    providers: [
        NavigatorService,
        { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CachingInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthorizedInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
