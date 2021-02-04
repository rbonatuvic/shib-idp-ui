import { Component, ViewChild, Input } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule, SpyNgModuleFactoryLoader } from '@angular/router/testing';
import { StoreModule, combineReducers, Store } from '@ngrx/store';
import { NgbDropdownModule, NgbModalModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { MetadataConfiguration } from '../model/metadata-configuration';
import * as fromConfiguration from '../reducer';
import * as fromFilters from '../../filter/reducer';
import * as fromProviders from '../../provider/reducer';
import * as fromResolvers from '../../resolver/reducer';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { MetadataOptionsComponent } from './metadata-options.component';
import { CommonModule, ViewportScroller } from '@angular/common';

import {
    MetadataConfigurationComponentStub,
    MetadataHeaderComponentStub
} from '../../../../testing/metadata-configuration.stub';
import {
    FilterConfigurationListComponentStub
} from '../../../../testing/filter-list.stub';
import { Metadata } from '../../domain/domain.type';
import { FilterActionTypes } from '../../filter/action/filter.action';
import { FilterCollectionActionTypes } from '../../filter/action/collection.action';
import { MetadataFilter } from '../../domain/model';
import { NgbModalStub } from '../../../../testing/modal.stub';

@Component({
    template: `
        <metadata-options-page></metadata-options-page>
    `
})
class TestHostComponent {
    @ViewChild(MetadataOptionsComponent, {static: true})
    public componentUnderTest: MetadataOptionsComponent;

    configuration: MetadataConfiguration = {
        dates: [],
        sections: []
    };
}

describe('Metadata Options Page Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: MetadataOptionsComponent;
    let store: Store<fromConfiguration.State>;
    let dispatchSpy;
    let scroller: ViewportScroller;
    let filter = {
        type: 'EntityAttributesFilter',
        resourceId: 'foo',
        name: 'name',
        createdBy: 'admin'
    } as MetadataFilter;
    let modal: NgbModal;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                StoreModule.forRoot({
                    'metadata-configuration': combineReducers(fromConfiguration.reducers),
                    'filter': combineReducers(fromFilters.reducers),
                    'provider': combineReducers(fromProviders.reducers),
                    'resolver': combineReducers(fromResolvers.reducers)
                }),
                MockI18nModule,
                RouterTestingModule,
                CommonModule
            ],
            declarations: [
                MetadataOptionsComponent,
                MetadataConfigurationComponentStub,
                MetadataHeaderComponentStub,
                TestHostComponent,
                FilterConfigurationListComponentStub
            ],
            providers: [
                {
                    provide: NgbModal,
                    useClass: NgbModalStub
                }
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        scroller = TestBed.get(ViewportScroller);
        modal = TestBed.get(NgbModal);
        dispatchSpy = spyOn(store, 'dispatch');
        spyOn(store, 'select').and.callThrough();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should load metadata objects', waitForAsync(() => {
        expect(app).toBeTruthy();
        expect(store.select).toHaveBeenCalled();
    }));

    describe('setModel method', () => {
        it('should set the id and kind attributes on the component', () => {
            app.setModel({ id: 'foo' } as Metadata);
            expect(app.id).toBe('foo');
            expect(app.kind).toBe('resolver');
        });

        it('should dispatch a LoadFilterRequest event if the provided model is a provider', () => {
            app.setModel({resourceId: 'foo', '@type': 'FileBackedHttpMetadataResolver'} as Metadata);
            expect(store.dispatch).toHaveBeenCalled();
            expect(dispatchSpy.calls.mostRecent().args[0].type).toBe(FilterCollectionActionTypes.LOAD_FILTER_REQUEST);
        });
    });

    describe('onScrollTo', () => {
        it('should call the viewportscroller', () => {
            spyOn(scroller, 'scrollToAnchor');
            app.onScrollTo('fragment');
            expect(scroller.scrollToAnchor).toHaveBeenCalled();
        });
    });

    describe('order methods', () => {
        it('updateOrderUp should dispatch a ChangeFilterOrderUp action', () => {
            app.updateOrderUp(filter);
            expect(store.dispatch).toHaveBeenCalled();
            expect(dispatchSpy.calls.mostRecent().args[0].type).toBe(FilterCollectionActionTypes.CHANGE_FILTER_ORDER_UP);
        });

        it('updateOrderDown should dispatch a ChangeFilterOrderDown action', () => {
            app.updateOrderDown(filter);
            expect(store.dispatch).toHaveBeenCalled();
            expect(dispatchSpy.calls.mostRecent().args[0].type).toBe(FilterCollectionActionTypes.CHANGE_FILTER_ORDER_DOWN);
        });
    });

    describe('removeFilter method', () => {
        it('should open a modal', () => {
            spyOn(modal, 'open').and.returnValue({
                result: Promise.resolve(true)
            } as NgbModalRef);
            app.removeFilter('foo');
            expect(modal.open).toHaveBeenCalled();
        });
    });
});
