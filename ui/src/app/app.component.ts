import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';

import * as fromRoot from './core/reducer';
import { VersionInfo } from './core/model/version';
import { LoadProviderRequest } from './metadata-provider/action/provider.action';
import { LoadDraftRequest } from './metadata-provider/action/draft.action';
import { VersionInfoLoadRequestAction } from './core/action/version.action';
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

    constructor(private store: Store<fromRoot.State>) {
        this.version$ = this.store.select(fromRoot.getVersionInfo);
        this.formatted$ = this.version$.map(v => v && v.build ? `${v.build.version}-${v.git.commit.id}` : '');
    }

    ngOnInit(): void {
        this.store.dispatch(new LoadProviderRequest());
        this.store.dispatch(new LoadDraftRequest());
        this.store.dispatch(new VersionInfoLoadRequestAction());
    }
}
