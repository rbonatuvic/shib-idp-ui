import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NewResolverComponent } from './new-resolver.component';
import * as fromResolver from '../reducer';
import { BlankResolverComponent } from './blank-resolver.component';
import { UploadResolverComponent } from './upload-resolver.component';

describe('Blank Resolver Page', () => {
    let fixture: ComponentFixture<BlankResolverComponent>;
    let store: Store<fromResolver.State>;
    let instance: BlankResolverComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                StoreModule.forRoot({
                    collections: combineReducers(fromResolver.reducers),
                }),
                ReactiveFormsModule,
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
