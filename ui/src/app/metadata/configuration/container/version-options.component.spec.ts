import { Component, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, combineReducers } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { VersionOptionsComponent } from './version-options.component';
import * as fromConfiguration from '../reducer';
import * as fromProviders from '../../provider/reducer';
import * as fromResolvers from '../../resolver/reducer';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { Metadata } from '../../domain/domain.type';
import { ViewportScroller } from '@angular/common';

@Component({
    template: `
        <version-options-page></version-options-page>
    `
})
class TestHostComponent {
    @ViewChild(VersionOptionsComponent, {static: true})
    public componentUnderTest: VersionOptionsComponent;
}

describe('Metadata Version Options Page Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: VersionOptionsComponent;
    let scroller: ViewportScroller;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                StoreModule.forRoot({
                    'metadata-configuration': combineReducers(fromConfiguration.reducers),
                    'provider': combineReducers(fromProviders.reducers),
                    'resolver': combineReducers(fromResolvers.reducers)
                }),
                MockI18nModule,
                RouterTestingModule
            ],
            declarations: [
                VersionOptionsComponent,
                TestHostComponent
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        }).compileComponents();

        scroller = TestBed.get(ViewportScroller);

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should compile', () => {
        expect(app).toBeTruthy();
    });

    describe('setModel method', () => {
        it('should set attributes based on the passed data', () => {
            app.setModel({ id: 'foo', '@type': 'bar' } as Metadata);
            expect(app.id).toBe('foo');
            expect(app.kind).toBe('provider');

            app.setModel({ resourceId: 'baz' } as Metadata);
            expect(app.id).toBe('baz');
            expect(app.kind).toBe('resolver');
        });
    });

    describe('onScrollTo method', () => {
        it('should set attributes based on the passed data', () => {
            spyOn(scroller, 'scrollToAnchor');
            app.onScrollTo('foo');
            expect(scroller.scrollToAnchor).toHaveBeenCalledWith('foo');
        });
    });
});
