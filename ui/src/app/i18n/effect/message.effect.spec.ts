import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';

import { MessageEffects } from './message.effect';

import { Subject, of, throwError } from 'rxjs';
import { MessagesLoadRequestAction, MessagesLoadSuccessAction, MessagesLoadErrorAction } from '../action/message.action';
import { I18nService } from '../service/i18n.service';
import { StoreModule, combineReducers, Store } from '@ngrx/store';
import * as fromI18n from '../reducer';

xdescribe('I18n Message Effects', () => {
    let effects: MessageEffects;
    let actions: Subject<any>;
    let i18nService: I18nService;
    let store: Store<fromI18n.State>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    core: combineReducers(fromI18n.reducers, {
                        messages: {
                            fetching: false,
                            messages: null,
                            error: null,
                            locale: 'en-US'
                        }
                    })
                }),
            ],
            providers: [
                {
                    provide: I18nService, useValue: {
                        get: (locale: string) => of({})
                    }
                },
                MessageEffects,
                provideMockActions(() => actions),
            ],
        });

        effects = TestBed.get(MessageEffects);
        i18nService = TestBed.get(I18nService);
        store = TestBed.get(Store);
        spyOn(store, 'dispatch');
    });

    it('should fire a success action', () => {
        let msgs = {};
        spyOn(i18nService, 'get').and.returnValue(of(msgs));
        spyOn(store, 'select').and.returnValue(of('en_US'));
        actions = new ReplaySubject(1);

        actions.next(new MessagesLoadRequestAction());

        effects.loadMessages$.subscribe(result => {
            expect(result).toEqual(new MessagesLoadSuccessAction(msgs));
        });
    });

    it('should fire an error action', () => {
        let err = new Error('404');
        spyOn(i18nService, 'get').and.returnValue(throwError(err));
        spyOn(store, 'select').and.returnValue(of('en_US'));
        actions = new ReplaySubject(1);

        actions.next(new MessagesLoadRequestAction());

        effects.loadMessages$.subscribe(result => {
            expect(result).toEqual(new MessagesLoadErrorAction(err));
        });
    });
});
