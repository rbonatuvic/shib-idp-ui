import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NewProviderComponent } from './new-provider.component';
import * as fromCollections from '../../domain/reducer';
import { BlankProviderComponent } from './blank-provider.component';
import { UploadProviderComponent } from './upload-provider.component';

describe('New Provider Page', () => {
    let fixture: ComponentFixture<NewProviderComponent>;
    let store: Store<fromCollections.State>;
    let instance: NewProviderComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot({
                    collections: combineReducers(fromCollections.reducers),
                }),
                ReactiveFormsModule,
            ],
            declarations: [
                NewProviderComponent,
                BlankProviderComponent,
                UploadProviderComponent
            ],
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
