import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import * as fromAdmin from '../reducer';
import { AdminManagementPageComponent } from './admin-management.component';
import { MockI18nModule } from '../../../../testing/i18n.stub';

describe('Admin Management Page Component', () => {
    let fixture: ComponentFixture<AdminManagementPageComponent>;
    let store: Store<fromAdmin.State>;
    let instance: AdminManagementPageComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    'admin': combineReducers(fromAdmin.reducers),
                }),
                FormsModule,
                MockI18nModule
            ],
            declarations: [
                AdminManagementPageComponent
            ],
        });

        fixture = TestBed.createComponent(AdminManagementPageComponent);
        instance = fixture.componentInstance;
        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });

    /*
    describe('cancel method', () => {
        it('should dispatch a cancel changes action', () => {
            fixture.detectChanges();
            instance.cancel();
            expect(store.dispatch).toHaveBeenCalled();
        });
    });

    describe('preview method', () => {
        it('should dispatch a cancel changes action', () => {
            fixture.detectChanges();
            instance.cancel();
            expect(store.dispatch).toHaveBeenCalled();
        });
    });
    */
});
