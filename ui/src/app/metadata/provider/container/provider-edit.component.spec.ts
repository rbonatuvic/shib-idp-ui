import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ProviderEditComponent } from './provider-edit.component';
import * as fromRoot from '../reducer';
import * as fromWizard from '../../../wizard/reducer';
import { SharedModule } from '../../../shared/shared.module';
import { ActivatedRouteStub } from '../../../../testing/activated-route.stub';
import { FileBackedHttpMetadataProviderEditor } from '../model';
import { ProviderEditorNavComponent } from '../component/provider-editor-nav.component';

@Component({
    template: `
        <provider-edit></provider-edit>
    `
})
class TestHostComponent {
    @ViewChild(ProviderEditComponent)
    public componentUnderTest: ProviderEditComponent;
}

describe('Provider Edit Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: ProviderEditComponent;
    let store: Store<fromRoot.State>;
    let router: Router;
    let activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
    let child: ActivatedRouteStub = new ActivatedRouteStub();
    child.testParamMap = { form: 'common' };
    activatedRoute.firstChild = child;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule.forRoot(),
                RouterTestingModule,
                SharedModule,
                StoreModule.forRoot({
                    provider: combineReducers(fromRoot.reducers),
                    wizard: combineReducers(fromWizard.reducers, {
                        wizard: {
                            index: 'common',
                            disabled: false,
                            definition: FileBackedHttpMetadataProviderEditor,
                            schemaCollection: []
                        }
                    })
                })
            ],
            declarations: [
                ProviderEditComponent,
                TestHostComponent,
                ProviderEditorNavComponent
            ],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRoute },
                { provide: APP_BASE_HREF, useValue: '/' }
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        router = TestBed.get(Router);
        spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should instantiate the component', async(() => {
        expect(app).toBeTruthy();
    }));

    describe('setIndex method', () => {
        it('should interrupt event default and dispatch an event', () => {
            app.setIndex('common');
            expect(store.dispatch).toHaveBeenCalled();
        });
    });

    describe('go method', () => {
        it('should route to the given child form', () => {
            spyOn(router, 'navigate');
            app.go('common');
            expect(router.navigate).toHaveBeenCalled();
        });
    });

    describe('save method', () => {
        it('should route to the given child form', () => {
            app.save();
            expect(store.dispatch).toHaveBeenCalled();
        });
    });

    describe('cancel method', () => {
        it('should route to the metadata manager', () => {
            spyOn(router, 'navigate');
            app.cancel();
            expect(router.navigate).toHaveBeenCalled();
        });
    });
});
