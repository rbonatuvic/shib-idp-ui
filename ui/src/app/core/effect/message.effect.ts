import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';

import {
    MessagesActionTypes,
    MessagesLoadErrorAction,
    MessagesLoadRequestAction,
    MessagesLoadSuccessAction,
    SetLanguage
} from '../action/message.action';
import { I18nService } from '../service/i18n.service';
import * as fromCore from '../reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class MessageEffects {

    @Effect()
    loadMessages$ = this.actions$.pipe(
        ofType<MessagesLoadRequestAction>(MessagesActionTypes.MESSAGES_LOAD_REQUEST),
        withLatestFrom(this.store.select(fromCore.getLanguage)),
        switchMap(([action, lang]) => {
            return this.i18nService.get(lang)
                .pipe(
                    map(u => new MessagesLoadSuccessAction({ ...u })),
                    catchError(error => of(new MessagesLoadErrorAction(error)))
                );
        })
    );
    @Effect()
    setLanguage$ = this.actions$.pipe(
        ofType<SetLanguage>(MessagesActionTypes.SET_LANGUAGE),
        map(action => action.payload),
        map(language => new MessagesLoadRequestAction())
    );

    constructor(
        private i18nService: I18nService,
        private actions$: Actions,
        private store: Store<fromCore.State>
    ) { }
}
