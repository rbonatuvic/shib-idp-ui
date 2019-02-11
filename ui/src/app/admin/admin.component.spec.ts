import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, combineReducers, Store } from '@ngrx/store';
import * as fromAdmin from './reducer';

describe('Admin Root Component', () => {
    let fixture: ComponentFixture<AdminComponent>;
    let instance: AdminComponent;
    let store: Store<fromAdmin.State>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                StoreModule.forRoot({
                    admin: combineReducers(fromAdmin.reducers)
                })
            ],
            declarations: [
                AdminComponent
            ],
        });

        store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(AdminComponent);
        instance = fixture.componentInstance;
    });

    it('should compile', () => {
        fixture.detectChanges();
        expect(fixture).toBeDefined();
    });
});
