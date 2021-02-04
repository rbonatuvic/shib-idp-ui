import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';

import { VersionEffects } from './version.effect';
import {
    VersionInfoLoadRequestAction,
    VersionInfoLoadSuccessAction,
    VersionInfoLoadErrorAction
} from '../action/version.action';
import { Subject, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { VersionInfo } from '../model/version';

describe('Version Effects', () => {
    let effects: VersionEffects;
    let actions: Subject<any>;
    let httpClient = {
        get: () => of({})
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: HttpClient, useValue: httpClient },
                VersionEffects,
                provideMockActions(() => actions),
            ],
        });

        effects = TestBed.get(VersionEffects);
        httpClient = TestBed.get(HttpClient);
    });

    it('should fire a success action', () => {
        let v = {};
        spyOn(httpClient, 'get').and.returnValue(of({}));
        actions = new ReplaySubject(1);

        actions.next(new VersionInfoLoadRequestAction());

        effects.loadVersionInfo$.subscribe(result => {
            expect(result).toEqual(new VersionInfoLoadSuccessAction(v as VersionInfo));
        });
    });

    it('should fire an error action', () => {
        let err = new Error('404');
        spyOn(httpClient, 'get').and.returnValue(throwError(err));
        actions = new ReplaySubject(1);

        actions.next(new VersionInfoLoadRequestAction());

        effects.loadVersionInfo$.subscribe(result => {
            expect(result).toEqual(new VersionInfoLoadErrorAction(err));
        });
    });
});
