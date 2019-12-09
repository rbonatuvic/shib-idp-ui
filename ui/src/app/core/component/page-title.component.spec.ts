import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromWizard from '../../wizard/reducer';
import * as fromI18n from '../../i18n/reducer';
import * as fromCore from '../reducer';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleComponent } from './page-title.component';
import { MockI18nModule, MockI18nService } from '../../../testing/i18n.stub';
import { I18nService } from '../../i18n/service/i18n.service';

@Component({
    template: `<page-title></page-title>`
})
class TestHostComponent {
    @ViewChild(PageTitleComponent, { static: true })
    public componentUnderTest: PageTitleComponent;
}

describe('Page Title Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: PageTitleComponent;
    let store: Store<fromWizard.State>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                RouterTestingModule,
                StoreModule.forRoot({
                    wizard: combineReducers(fromWizard.reducers),
                    core: combineReducers(fromCore.reducers),
                    i18n: combineReducers(fromI18n.reducers)
                }),
                MockI18nModule
            ],
            declarations: [
                PageTitleComponent,
                TestHostComponent
            ],
            providers: [
                {
                    provide: I18nService,
                    useClass: MockI18nService
                }
            ]
        }).compileComponents();

        store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should compile without error', () => {
        expect(app).toBeTruthy();
    });
});
