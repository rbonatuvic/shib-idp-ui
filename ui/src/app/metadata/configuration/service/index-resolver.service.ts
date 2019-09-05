import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { WizardState } from '../../../wizard/reducer';
import { SetIndex } from '../../../wizard/action/wizard.action';

@Injectable()
export class IndexResolver implements Resolve<void> {
    constructor(private store: Store<WizardState>) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.store.dispatch(new SetIndex(route.params.index));
    }
}
