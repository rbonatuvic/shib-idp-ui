import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { TestBed, async, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbDropdownModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProviderEditComponent } from './provider-edit.component';
import * as fromRoot from '../reducer';
import * as fromWizard from '../../../wizard/reducer';
import { SharedModule } from '../../../shared/shared.module';
import { ActivatedRouteStub } from '../../../../testing/activated-route.stub';
import { FileBackedHttpMetadataProviderEditor } from '../model';
import { EditorNavComponent } from '../../domain/component/editor-nav.component';
import { NgbModalStub } from '../../../../testing/modal.stub';
import { MetadataProvider } from '../../domain/model';
import { of } from 'rxjs';
import { DifferentialService } from '../../../core/service/differential.service';
import { MockI18nModule } from '../../../../testing/i18n.stub';

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
    let modal: NgbModal;
    child.testParamMap = { form: 'common' };
    activatedRoute.firstChild = child;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                RouterTestingModule.withRoutes([
                    {path: 'edit', children: []},
                    {path: 'foo', children: []},
                    {path: '', children: []}
                ]),
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
                            schema: {},
                            locked: false,
                            schemaCollection: []
                        }
                    })
                }),
                MockI18nModule
            ],
            declarations: [
                ProviderEditComponent,
                TestHostComponent,
                EditorNavComponent
            ],
            providers: [
                DifferentialService,
                { provide: NgbModal, useClass: NgbModalStub },
                { provide: ActivatedRoute, useValue: activatedRoute },
                { provide: APP_BASE_HREF, useValue: '/' }
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        router = TestBed.get(Router);
        modal = TestBed.get(NgbModal);
        spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should instantiate the component', async(() => {
        expect(app).toBeTruthy();
    }));

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
            spyOn(app, 'clear');
            app.cancel();
            expect(router.navigate).toHaveBeenCalled();
            expect(app.clear).toHaveBeenCalled();
        });
    });

    describe('clear method', () => {
        it('should dispatch actions to clear the reducer state', () => {
            app.clear();
            expect(store.dispatch).toHaveBeenCalled();
        });
    });

    describe('canDeactivate method', () => {
        it('should check if the current route is another edit page', (done) => {
            let route = new ActivatedRouteStub(),
                snapshot = route.snapshot;
            let result = app.canDeactivate(null, { url: 'edit', root: null }, { url: 'edit', root: null });
            result.subscribe(can => {
                expect(can).toBe(true);
                done();
            });
            fixture.detectChanges();
        });

        it('should open a modal', (done) => {
            app.latest = <MetadataProvider>{ name: 'bar' };
            spyOn(store, 'select').and.returnValue(of(false));
            spyOn(modal, 'open').and.returnValue({ result: Promise.resolve('closed') } as NgbModalRef);
            fixture.detectChanges();
            let route = new ActivatedRouteStub(),
                snapshot = route.snapshot;
            let result = app.canDeactivate(null, { url: 'edit', root: null }, { url: 'foo', root: null });
            result.subscribe(can => {
                expect(can).toBe(false);
                expect(modal.open).toHaveBeenCalled();
                done();
            });
            fixture.detectChanges();
        });
    });
});
