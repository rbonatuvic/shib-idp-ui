import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NewProviderComponent } from './new-provider.component';

import { BlankProviderComponent } from './blank-provider.component';
import { UploadProviderComponent } from './upload-provider.component';
import { CopyProviderComponent } from './copy-provider.component';
import { SharedModule } from '../../shared/shared.module';
import { NavigatorService } from '../../core/service/navigator.service';
import * as fromProvider from '../reducer';
import * as fromCollections from '../../domain/reducer';
import { RouterStub } from '../../../testing/router.stub';
import { ActivatedRouteStub } from '../../../testing/activated-route.stub';
import { I18nTextComponent } from '../../domain/component/i18n-text.component';

describe('New Resolver Page', () => {
    let fixture: ComponentFixture<NewProviderComponent>;
    let store: Store<fromCollections.State>;
    let instance: NewProviderComponent;
    let activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
    activatedRoute.testParamMap = { id: 'foo' };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot({
                    collections: combineReducers(fromCollections.reducers),
                    provider: combineReducers(fromProvider.reducers)
                }),
                ReactiveFormsModule,
                SharedModule,
                RouterModule.forRoot([])
            ],
            declarations: [
                NewProviderComponent,
                BlankProviderComponent,
                UploadProviderComponent,
                CopyProviderComponent,
                I18nTextComponent
            ],
            providers: [
                NavigatorService,
                { provide: ActivatedRoute, useValue: activatedRoute },
                { provide: APP_BASE_HREF, useValue: '/' }
            ]
        });

        fixture = TestBed.createComponent(NewProviderComponent);
        instance = fixture.componentInstance;
        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});
