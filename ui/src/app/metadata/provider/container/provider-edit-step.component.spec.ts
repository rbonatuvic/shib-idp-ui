import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ProviderEditStepComponent } from './provider-edit-step.component';
import * as fromRoot from '../reducer';
import * as fromWizard from '../../../wizard/reducer';
import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from 'ngx-schema-form';
import { SharedModule } from '../../../shared/shared.module';
import { FileBackedHttpMetadataProviderEditor } from '../model';

@Component({
    template: `
        <provider-edit-step></provider-edit-step>
    `
})
class TestHostComponent {
    @ViewChild(ProviderEditStepComponent)
    public componentUnderTest: ProviderEditStepComponent;
}

describe('Provider Edit Step Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ProviderEditStepComponent;
    let store: Store<fromRoot.State>;
    let storeSpy: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                RouterTestingModule,
                SchemaFormModule.forRoot(),
                SharedModule,
                StoreModule.forRoot({
                    provider: combineReducers(fromRoot.reducers),
                    wizard: combineReducers(fromWizard.reducers, {
                        wizard: {
                            index: 'common',
                            disabled: false,
                            definition: FileBackedHttpMetadataProviderEditor,
                            schemaPath: '',
                            loading: false,
                            schema: {
                                type: 'object',
                                properties: {
                                    foo: {
                                        type: 'string'
                                    }
                                }
                            },
                            locked: false,
                            schemaCollection: []
                        }
                    })
                })
            ],
            declarations: [
                ProviderEditStepComponent,
                TestHostComponent
            ],
            providers: [
                { provide: WidgetRegistry, useClass: DefaultWidgetRegistry }
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        storeSpy = spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should instantiate the component', async(() => {
        expect(app).toBeTruthy();
    }));

    describe('updateStatus method', () => {
        it('should update the status with provided errors', () => {
            storeSpy.calls.reset();
            app.currentPage = 'common';
            app.updateStatus({value: 'common'});
            expect(store.dispatch).toHaveBeenCalledTimes(1);
        });
    });

    describe('valueChangeEmitted$ subject', () => {
        it('should update the provider', fakeAsync(() => {
            app.valueChangeSubject.next({value: { name: 'foo' } });
            fixture.detectChanges();
            tick();
            fixture.detectChanges();
            expect(store.dispatch).toHaveBeenCalled();
        }));
    });
});
