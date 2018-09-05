import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import * as fromRoot from './core/reducer';
import { VersionInfo } from './core/model/version';
import { VersionInfoLoadRequestAction } from './core/action/version.action';
import { I18nService } from './core/service/i18n.service';
import { SetLanguage } from './core/action/message.action';

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

    formatter = v => v && v.build ? `${v.build.version}-${v.git.commit.id}` : '';

    constructor(
        private store: Store<fromRoot.State>,
        private i18nService: I18nService
    ) {
        this.version$ = this.store.select(fromRoot.getVersionInfo);
        this.formatted$ = this.version$.pipe(map(this.formatter));
    }

    ngOnInit(): void {
        this.store.dispatch(new VersionInfoLoadRequestAction());
        this.store.dispatch(new SetLanguage(this.i18nService.getCurrentLanguage()));
    }
}
