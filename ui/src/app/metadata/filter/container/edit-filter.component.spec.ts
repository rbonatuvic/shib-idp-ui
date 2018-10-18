import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import * as fromFilter from '../reducer';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../domain/service/provider-change-emitter.service';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { NavigatorService } from '../../../core/service/navigator.service';
import { SharedModule } from '../../../shared/shared.module';
import { EditFilterComponent } from './edit-filter.component';
import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from 'ngx-schema-form';
import { SchemaService } from '../../../schema-form/service/schema.service';
import { HttpClientModule } from '@angular/common/http';
import { MockI18nModule } from '../../../../testing/i18n.stub';

describe('New Metadata Filter Page', () => {
    let fixture: ComponentFixture<EditFilterComponent>;
    let store: Store<fromFilter.State>;
    let instance: EditFilterComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProviderStatusEmitter,
                ProviderValueEmitter,
                FormBuilder,
                NgbPopoverConfig,
                NavigatorService,
                SchemaService,
                { provide: WidgetRegistry, useClass: DefaultWidgetRegistry }
            ],
            imports: [
                StoreModule.forRoot({
                    'filter': combineReducers(fromFilter.reducers),
                }),
                ReactiveFormsModule,
                NgbPopoverModule,
                SharedModule,
                HttpClientModule,
                SchemaFormModule.forRoot(),
                MockI18nModule
            ],
            declarations: [
                EditFilterComponent
            ],
        });

        fixture = TestBed.createComponent(EditFilterComponent);
        instance = fixture.componentInstance;
        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });

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

    describe('status emitter', () => {
        it('should set the isValid property to true', () => {
            fixture.detectChanges();
            instance.statusChangeSubject.next({value: []});
            fixture.detectChanges();
            expect(instance.isValid).toBe(true);
        });

        it('should set the isValid property to true if value is undefined', () => {
            fixture.detectChanges();
            instance.statusChangeSubject.next({value: null});
            fixture.detectChanges();
            expect(instance.isValid).toBe(true);
        });

        it('should set the isValid property to false', () => {
            fixture.detectChanges();
            instance.statusChangeSubject.next({ value: [{control: 'foo'}] });
            fixture.detectChanges();
            expect(instance.isValid).toBe(false);
        });
    });
});
