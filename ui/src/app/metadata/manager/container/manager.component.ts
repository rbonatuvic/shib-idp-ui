import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoadResolverRequest } from '../../resolver/action/collection.action';
import { LoadDraftRequest } from '../../resolver/action/draft.action';
import * as fromRoot from '../../../app.reducer';
import { LoadProviderRequest } from '../../provider/action/collection.action';

@Component({
    selector: 'manager-page',
    templateUrl: './manager.component.html',
    styleUrls: ['./manager.component.scss']
})
export class ManagerComponent {
    constructor(
        private store: Store<fromRoot.State>
    ) {
        this.store.dispatch(new LoadResolverRequest());
        this.store.dispatch(new LoadDraftRequest());
        this.store.dispatch(new LoadProviderRequest());
    }
}
