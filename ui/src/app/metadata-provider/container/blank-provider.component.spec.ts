import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NewProviderComponent } from './new-provider.component';
import * as fromProviders from '../reducer';
import { BlankProviderComponent } from './blank-provider.component';
import { UploadProviderComponent } from './upload-provider.component';

describe('Blank Provider Page', () => {
    let fixture: ComponentFixture<BlankProviderComponent>;
    let store: Store<fromProviders.State>;
    let instance: BlankProviderComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot({
                    user: combineReducers(fromProviders.reducers),
                }),
                ReactiveFormsModule,
            ],
            declarations: [
                NewProviderComponent,
                BlankProviderComponent,
                UploadProviderComponent
            ],
        });

        fixture = TestBed.createComponent(BlankProviderComponent);
        instance = fixture.componentInstance;
        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });
});
