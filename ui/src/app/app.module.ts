import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
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
import { NavigatorService } from './core/service/navigator.service';
import { ContentionModule } from './contention/contention.module';
import { SharedModule } from './shared/shared.module';
import { WizardModule } from './wizard/wizard.module';
import { FormModule } from './schema-form/schema-form.module';
import { environment } from '../environments/environment.prod';
import { getCurrentLanguage } from './shared/util';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        StoreModule.forRoot(reducers, {
            metaReducers
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
        }),
        EffectsModule.forRoot([]),
        BrowserModule,
        CoreModule.forRoot(),
        StoreRouterConnectingModule,
        NgbDropdownModule.forRoot(),
        NgbModalModule.forRoot(),
        NgbPopoverModule.forRoot(),
        NgbPaginationModule.forRoot(),
        WizardModule.forRoot(),
        FormModule.forRoot(),
        NotificationModule,
        HttpClientModule,
        ContentionModule,
        SharedModule,
        AppRoutingModule
    ],
    providers: [
        { provide: LOCALE_ID, useValue: getCurrentLanguage() },
        NavigatorService,
        { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
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
