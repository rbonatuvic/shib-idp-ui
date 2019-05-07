import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { VersionHistoryComponent } from './version-history.component';
import { MetadataHistory } from '../model/history';
import { MetadataVersion } from '../model/version';
import { HistoryService } from '../service/history.service';
import { of } from 'rxjs';

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
    let fixture: ComponentFixture<VersionHistoryComponent>;
    let instance: VersionHistoryComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: HistoryService, useValue: MockHistoryService
                }
            ],
            imports: [
                MockI18nModule
            ],
            declarations: [
                MockHistoryListComponent,
                VersionHistoryComponent
            ],
        });

        fixture = TestBed.createComponent(VersionHistoryComponent);
        instance = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(instance).toBeDefined();
    });
});
