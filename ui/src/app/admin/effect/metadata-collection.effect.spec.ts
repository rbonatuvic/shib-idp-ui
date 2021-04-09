import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject, Observable, of, ReplaySubject } from 'rxjs';
import { StoreModule, combineReducers } from '@ngrx/store';

import { MetadataCollectionEffects } from './metadata-collection.effect';
import { LoadMetadataRequest, LoadMetadataSuccess } from '../action/metadata-collection.action';
import { ResolverService } from '../../metadata/domain/service/resolver.service';
import { Metadata } from '../../metadata/domain/domain.type';
import { MetadataResolver } from '../../metadata/domain/model';
import * as fromI18n from '../../i18n/reducer';
import { I18nService } from '../../i18n/service/i18n.service';
import { Router } from '@angular/router';
import { RouterStub } from '../../../testing/router.stub';

describe('Metadata Collection Effects', () => {
    let effects: MetadataCollectionEffects;
    let actions: Subject<any>;

    let md: Metadata = {
        serviceProviderName: 'foo',
        name: 'foo',
        type: 'bar',
        resourceId: 'foo',
        createdBy: 'admin'
    };

    let resolverService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    'i18n': combineReducers(fromI18n.reducers),
                })
            ],
            providers: [
                {
                    provide: ResolverService,
                    useValue: jasmine.createSpyObj(
                        'ResolverService',
                        [
                            'queryForAdmin',
                            'update',
                            'remove'
                        ]
                    )
                },
                {
                    provide: I18nService,
                    useValue: jasmine.createSpyObj(
                        'I18nService',
                        [
                            'translate'
                        ]
                    )
                },
                MetadataCollectionEffects,
                provideMockActions(() => actions),
                { provide: Router, useClass: RouterStub }
            ],
        });

        effects = TestBed.get(MetadataCollectionEffects);
        resolverService = TestBed.get(ResolverService);
    });

    describe(`loadMetadatas$ effect`, () => {
        it('should load admins and fire a success action', () => {
            resolverService.queryForAdmin.and.returnValue(of([md]));
            actions = new ReplaySubject(1);

            actions.next(new LoadMetadataRequest());

            effects.loadMetadatas$.subscribe(result => {
                expect(result).toEqual(new LoadMetadataSuccess([md] as MetadataResolver[]));
            });
        });
    });
});
