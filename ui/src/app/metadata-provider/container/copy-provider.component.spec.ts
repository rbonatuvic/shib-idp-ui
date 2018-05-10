import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NewProviderComponent } from './new-provider.component';
import * as fromCollections from '../../domain/reducer';
import * as fromProvider from '../reducer';
import { CopyProviderComponent } from './copy-provider.component';
import { SharedModule } from '../../shared/shared.module';
import { NavigatorService } from '../../core/service/navigator.service';

describe('Copy Provider Page', () => {
    let fixture: ComponentFixture<CopyProviderComponent>;
    let store: Store<fromCollections.State>;
    let instance: CopyProviderComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot({
                    collections: combineReducers(fromCollections.reducers),
                    provider: combineReducers(fromProvider.reducers)
                }),
                ReactiveFormsModule,
                SharedModule
            ],
            declarations: [
                CopyProviderComponent
            ],
            providers: [
                NavigatorService
            ]
        });

        fixture = TestBed.createComponent(CopyProviderComponent);
        instance = fixture.componentInstance;
        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});
