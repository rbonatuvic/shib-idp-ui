import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NewFilterComponent } from './new-filter.component';
import * as fromFilter from '../reducer';
import * as fromWizard from '../../../wizard/reducer';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../domain/service/provider-change-emitter.service';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { NavigatorService } from '../../../core/service/navigator.service';
import { SharedModule } from '../../../shared/shared.module';
import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from 'ngx-schema-form';
import { SchemaService } from '../../../schema-form/service/schema.service';
import { HttpClientModule } from '@angular/common/http';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../../testing/activated-route.stub';

describe('New Metadata Filter Page', () => {
    let fixture: ComponentFixture<NewFilterComponent>;
    let store: Store<fromFilter.State>;
    let instance: NewFilterComponent;

    let activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
    activatedRoute.testParamMap = { providerId: 'foo' };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProviderStatusEmitter,
                ProviderValueEmitter,
                FormBuilder,
                NgbPopoverConfig,
                NavigatorService,
                SchemaService,
                { provide: WidgetRegistry, useClass: DefaultWidgetRegistry },
                {
                    provide: ActivatedRoute, useValue: activatedRoute
                }
            ],
            imports: [
                StoreModule.forRoot({
                    'filter': combineReducers(fromFilter.reducers),
                    'wizard': combineReducers(fromWizard.reducers)
                }),
                ReactiveFormsModule,
                NgbPopoverModule,
                SharedModule,
                HttpClientModule,
                SchemaFormModule.forRoot(),
                MockI18nModule,
                RouterTestingModule
            ],
            declarations: [
                NewFilterComponent
            ],
        });

        fixture = TestBed.createComponent(NewFilterComponent);
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
});
