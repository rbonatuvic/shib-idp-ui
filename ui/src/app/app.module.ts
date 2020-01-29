import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { NgbDropdownModule, NgbModalModule, NgbPopoverModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';

import { reducers, metaReducers } from './app.reducer';
import { CustomRouterStateSerializer } from './shared/util';
import { AuthorizedInterceptor } from './core/service/authorized.interceptor';
import { NotificationModule } from './notification/notification.module';
import { ErrorInterceptor } from './core/service/error.interceptor';
import { ContentionModule } from './contention/contention.module';
import { SharedModule } from './shared/shared.module';
import { WizardModule } from './wizard/wizard.module';
import { FormModule } from './schema-form/schema-form.module';
import { environment } from '../environments/environment.prod';
import { I18nModule } from './i18n/i18n.module';
import { ApiPathInterceptor } from './core/service/api-path.interceptor';
import { APP_BASE_HREF } from '@angular/common';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        StoreModule.forRoot(reducers, {
            metaReducers,
            runtimeChecks: {
                strictActionImmutability: false,
                strictActionSerializability: false,
                strictStateImmutability: false,
                strictStateSerializability: false
            }
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
        }),
        EffectsModule.forRoot([]),
        BrowserModule,
        CoreModule,
        CoreModule.forRoot(),
        StoreRouterConnectingModule.forRoot(),
        NgbDropdownModule,
        NgbModalModule,
        NgbPopoverModule,
        NgbPaginationModule,
        WizardModule.forRoot(),
        FormModule.forRoot(),
        NotificationModule,
        HttpClientModule,
        ContentionModule,
        SharedModule,
        I18nModule.forRoot(),
        I18nModule,
        AppRoutingModule
    ],
    providers: [
        {
            provide: APP_BASE_HREF,
            useFactory: () => {
                const url = new URL(document.getElementsByTagName('base')[0].href);
                return url.pathname;
            }
        },
        {
            provide: RouterStateSerializer,
            useClass: CustomRouterStateSerializer
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
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiPathInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
