import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { MetadataHistoryComponent } from './metadata-history.component';
import { MetadataHistory } from '../model/history';
import { MetadataVersion } from '../model/version';
import { MetadataHistoryService } from '../service/history.service';
import { of } from 'rxjs';
import { StoreModule, combineReducers } from '@ngrx/store';
import * as fromConfiguration from '../reducer';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterStub } from '../../../../testing/router.stub';
import { ActivatedRouteStub } from '../../../../testing/activated-route.stub';

export const TestData = {
    versions: [
        {
            versionNumber: 1,
            saveDate: new Date(),
            changedBy: 'admin',
            actions: []
        }
    ]
};

@Component({
    selector: 'history-list',
    template: `<span></span>`
})
class MockHistoryListComponent {
    @Input() history: MetadataHistory;
    @Output() compare: EventEmitter<MetadataVersion[]> = new EventEmitter();
    @Output() restore: EventEmitter<MetadataVersion> = new EventEmitter();
}

const MockHistoryService = {
    query: () => of(TestData)
};

describe('Metadata Version History Component', () => {
    let fixture: ComponentFixture<MetadataHistoryComponent>;
    let instance: MetadataHistoryComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: MetadataHistoryService, useValue: MockHistoryService
                },
                {
                    provide: Router, useClass: RouterStub
                },
                {
                    provide: ActivatedRoute, useClass: ActivatedRouteStub
                }
            ],
            imports: [
                MockI18nModule,
                StoreModule.forRoot({
                    'metadata-configuration': combineReducers(fromConfiguration.reducers),
                }),
            ],
            declarations: [
                MockHistoryListComponent,
                MetadataHistoryComponent
            ],
        });

        fixture = TestBed.createComponent(MetadataHistoryComponent);
        instance = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(instance).toBeDefined();
    });
});
