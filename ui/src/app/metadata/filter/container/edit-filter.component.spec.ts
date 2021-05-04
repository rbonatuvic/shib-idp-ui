import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import * as fromFilter from '../reducer';
import * as fromWizard from '../../../wizard/reducer';
import { ProviderStatusEmitter, ProviderValueEmitter } from '../../domain/service/provider-change-emitter.service';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { NavigatorService } from '../../../core/service/navigator.service';
import { SharedModule } from '../../../shared/shared.module';
import { EditFilterComponent } from './edit-filter.component';
import { SchemaFormModule } from 'ngx-schema-form';
import { SchemaService } from '../../../schema-form/service/schema.service';
import { HttpClientModule } from '@angular/common/http';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { MetadataFilterTypes } from '../model';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from '../../../../testing/activated-route.stub';
import { ActivatedRoute } from '@angular/router';

describe('Edit Metadata Filter Page', () => {
    let fixture: ComponentFixture<EditFilterComponent>;
    let store: Store<fromFilter.State>;
    let instance: EditFilterComponent;

    let activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
    activatedRoute.testParamMap = { providerId: 'foo' };
    let child: ActivatedRouteStub = new ActivatedRouteStub();
    child.testParamMap = { form: 'common' };
    activatedRoute.firstChild = child;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProviderStatusEmitter,
                ProviderValueEmitter,
                FormBuilder,
                NgbPopoverConfig,
                NavigatorService,
                SchemaService,
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
                MockI18nModule
            ],
            declarations: [
                EditFilterComponent
            ],
        });

        fixture = TestBed.createComponent(EditFilterComponent);
        instance = fixture.componentInstance;
        store = TestBed.get(Store);

        spyOn(store, 'dispatch');
    });

    it('should compile', () => {
        fixture.detectChanges();

        expect(fixture).toBeDefined();
    });

    describe('cancel method', () => {
        it('should dispatch a cancel changes action', () => {
            fixture.detectChanges();
            instance.cancel('foo');
            expect(store.dispatch).toHaveBeenCalled();
        });
    });

    describe('preview method', () => {
        it('should dispatch a preview action', () => {
            fixture.detectChanges();
            instance.definition = MetadataFilterTypes.EntityAttributes;
            instance.preview('foo');
            expect(store.dispatch).toHaveBeenCalled();
        });
    });
});
