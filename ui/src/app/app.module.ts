import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { NgbDropdownModule, NgbModalModule, NgbPopoverModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { DomainModule } from './domain/domain.module';
import { MetadataProviderModule } from './metadata-provider/metadata-provider.module';

import { reducers, metaReducers } from './app.reducer';
import { CustomRouterStateSerializer } from './shared/util';

import { CachingInterceptor } from './core/service/cache.interceptor';
import { AuthorizedInterceptor } from './core/service/authorized.interceptor';
import { NotificationModule } from './notification/notification.module';
import { ErrorInterceptor } from './core/service/error.interceptor';
import { NavigatorService } from './core/service/navigator.service';

import { environment } from '../environments/environment';
import { ContentionModule } from './contention/contention.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        StoreModule.forRoot(reducers, {
            metaReducers
        }),
        EffectsModule.forRoot([]),
        BrowserModule,
        AppRoutingModule,
        CoreModule.forRoot(),
        MetadataProviderModule.forRoot(),
        DomainModule.forRoot(),
        StoreRouterConnectingModule,
        NgbDropdownModule.forRoot(),
        NgbModalModule.forRoot(),
        NgbPopoverModule.forRoot(),
        NgbPaginationModule.forRoot(),
        NotificationModule,
        ContentionModule,
        HttpClientModule
    ],
    providers: [
        NavigatorService,
        { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
        /*{
            provide: HTTP_INTERCEPTORS,
            useClass: CachingInterceptor,
            multi: true
        },*/
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
