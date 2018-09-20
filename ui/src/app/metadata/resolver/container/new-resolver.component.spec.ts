import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { StoreModule, Store } from '@ngrx/store';
import { NewResolverComponent } from './new-resolver.component';

import { BlankResolverComponent } from './blank-resolver.component';
import { UploadResolverComponent } from './upload-resolver.component';
import { CopyResolverComponent } from './copy-resolver.component';
import { SharedModule } from '../../../shared/shared.module';
import { NavigatorService } from '../../../core/service/navigator.service';
import * as fromResolver from '../reducer';
import { ActivatedRouteStub } from '../../../../testing/activated-route.stub';
import { I18nTextComponent } from '../../../shared/component/i18n-text.component';
import { MockI18nModule } from '../../../../testing/i18n.stub';

describe('New Resolver Page', () => {
    let fixture: ComponentFixture<NewResolverComponent>;
    let store: Store<fromResolver.State>;
    let instance: NewResolverComponent;
    let activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
    activatedRoute.testParamMap = { id: 'foo' };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot(fromResolver.reducers),
                ReactiveFormsModule,
                SharedModule,
                RouterModule.forRoot([]),
                MockI18nModule
            ],
            declarations: [
                NewResolverComponent,
                BlankResolverComponent,
                UploadResolverComponent,
                CopyResolverComponent
            ],
            providers: [
                NavigatorService,
                { provide: ActivatedRoute, useValue: activatedRoute },
                { provide: APP_BASE_HREF, useValue: '/' }
            ]
        });

        fixture = TestBed.createComponent(NewResolverComponent);
        instance = fixture.componentInstance;
        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});
