import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import * as fromRoot from './core/reducer';
import { VersionInfo } from './core/model/version';
import { VersionInfoLoadRequestAction } from './core/action/version.action';
import { I18nService } from './i18n/service/i18n.service';
import { SetLocale } from './i18n/action/message.action';
import { brand } from './app.brand';
import { Brand } from './core/model/brand';
import { UserLoadRequestAction } from './core/action/user.action';
import { Router } from '@angular/router';
import { NavigationService } from './core/service/navigation.service';
import { NavigationAction } from './core/model/action';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Shib UI';
    version$: Observable<VersionInfo>;
    version: string;
    formatted$: Observable<string>;
    today = new Date();
    year = new Date().getFullYear();
    isAdmin$: Observable<boolean>;
    brand: Brand = brand;
    nav$: Observable<NavigationAction[]>;

    formatter = v => v && v.build ? `${v.build.version}-${v.git.commit.id}` : '';

    constructor(
        private store: Store<fromRoot.State>,
        private i18nService: I18nService,
        private router: Router,
        private navService: NavigationService
    ) {
        this.version$ = this.store.select(fromRoot.getVersionInfo);
        this.formatted$ = this.version$.pipe(map(this.formatter));
        this.isAdmin$ = this.store.select(fromRoot.isCurrentUserAdmin);

        this.nav$ = this.navService.emitter;
    }

    ngOnInit(): void {
        this.store.dispatch(new UserLoadRequestAction());
        this.store.dispatch(new VersionInfoLoadRequestAction());
        this.store.dispatch(new SetLocale(this.i18nService.getCurrentLocale()));
    }
}
