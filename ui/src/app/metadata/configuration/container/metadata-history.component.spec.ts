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
            id: '1',
            date: new Date().toDateString(),
            creator: 'admin'
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
    let router: Router;

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
        router = TestBed.get(Router);
        spyOn(router, 'navigate');
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(instance).toBeDefined();
    });

    describe('compare versions method', () => {
        it('should call the router.navigate method', () => {
            instance.compareVersions(TestData.versions);
            expect(router.navigate).toHaveBeenCalled();
        });
    });

    describe('sortVersionsByDate method', () => {
        it('should sort the versions by their date', () => {
            const nowTime = new Date().getTime();
            const futureTime = nowTime + 10000;
            const beforeTime = nowTime - 10000;
            const nowDate = new Date(nowTime);
            const futureDate = new Date(futureTime);
            const beforeDate = new Date(beforeTime);

            const versions = [
                {
                    id: 'foo',
                    creator: 'bar',
                    date: nowDate.toISOString()
                },
                {
                    id: 'bar',
                    creator: 'baz',
                    date: beforeDate.toISOString()
                },
                {
                    id: 'baz',
                    creator: 'foo',
                    date: beforeDate.toISOString()
                },
                {
                    id: 'baz2',
                    creator: 'foo',
                    date: futureDate.toISOString()
                }
            ];

            const sorted = instance.sortVersionsByDate(versions);
            expect(sorted[0].id).toEqual('bar');
            expect(sorted[1].id).toEqual('baz');
            expect(sorted[2].id).toEqual('foo');
            expect(sorted[3].id).toEqual('baz2');
        });
    });
});
