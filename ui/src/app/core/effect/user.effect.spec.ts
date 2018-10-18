import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { UserEffects } from './user.effect';
import {
    UserLoadRequestAction,
    UserLoadSuccessAction,
    UserLoadErrorAction
} from '../action/user.action';
import { Subject, of, throwError } from 'rxjs';
import { UserService } from '../service/user.service';
import { User } from '../model/user';

describe('User Effects', () => {
    let effects: UserEffects;
    let actions: Subject<any>;
    let userService: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                UserEffects,
                UserService,
                provideMockActions(() => actions),
            ],
        });

        effects = TestBed.get(UserEffects);
        userService = TestBed.get(UserService);
    });

    it('should fire a success action', () => {
        let user = {};
        spyOn(userService, 'get').and.returnValue(of(user));
        actions = new ReplaySubject(1);

        actions.next(new UserLoadRequestAction());

        effects.loadUser$.subscribe(result => {
            expect(result).toEqual(new UserLoadSuccessAction(user as User));
        });
    });

    it('should fire an error action', () => {
        let err = new Error('404');
        spyOn(userService, 'get').and.returnValue(throwError(err));
        actions = new ReplaySubject(1);

        actions.next(new UserLoadRequestAction());

        effects.loadUser$.subscribe(result => {
            expect(result).toEqual(new UserLoadErrorAction(err));
        });
    });
});
