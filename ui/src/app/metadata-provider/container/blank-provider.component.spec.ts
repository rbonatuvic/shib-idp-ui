import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NewProviderComponent } from './new-provider.component';
import * as fromCollections from '../../domain/reducer';
import { BlankProviderComponent } from './blank-provider.component';
import { UploadProviderComponent } from './upload-provider.component';

describe('Blank Provider Page', () => {
    let fixture: ComponentFixture<BlankProviderComponent>;
    let store: Store<fromCollections.State>;
    let instance: BlankProviderComponent;

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
                BlankProviderComponent
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
