import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as fromUser from './core/reducer/user.reducer';
import { LoadProviderRequest } from './metadata-provider/action/provider.action';
import { LoadDraftRequest } from './metadata-provider/action/draft.action';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Shib UI';

    constructor(private store: Store<fromUser.UserState>) { }

    ngOnInit(): void {
        this.store.dispatch(new LoadProviderRequest());
        this.store.dispatch(new LoadDraftRequest());
    }
}
