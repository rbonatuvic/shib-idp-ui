import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { ResolverComponent } from './resolver.component';
import * as fromCollections from '../reducer';
import { ActivatedRouteStub } from '../../../../testing/activated-route.stub';

describe('Resolver Select (Editor) Page', () => {
    let fixture: ComponentFixture<ResolverComponent>;
    let store: Store<fromCollections.State>;
    let instance: ResolverComponent;
    let activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
    activatedRoute.testParamMap = { id: 'foo' };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: ActivatedRoute, useValue: activatedRoute },
                { provide: APP_BASE_HREF, useValue: '/' }
            ],
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot({
                    collections: combineReducers(fromCollections.reducers),
                }),
                ReactiveFormsModule,
                RouterModule.forRoot([])
            ],
            declarations: [ResolverComponent],
        });

        fixture = TestBed.createComponent(ResolverComponent);
        instance = fixture.componentInstance;
        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});
