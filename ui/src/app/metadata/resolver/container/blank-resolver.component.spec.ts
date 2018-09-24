import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import * as fromResolver from '../reducer';
import { BlankResolverComponent } from './blank-resolver.component';
import { MockI18nModule } from '../../../../testing/i18n.stub';

describe('Blank Resolver Page', () => {
    let fixture: ComponentFixture<BlankResolverComponent>;
    let store: Store<fromResolver.State>;
    let instance: BlankResolverComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot({
                    resolver: combineReducers(fromResolver.reducers),
                }),
                ReactiveFormsModule,
                MockI18nModule
            ],
            declarations: [
                BlankResolverComponent
            ],
        });

        fixture = TestBed.createComponent(BlankResolverComponent);
        instance = fixture.componentInstance;
        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});
