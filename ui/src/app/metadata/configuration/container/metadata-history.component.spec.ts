import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { MetadataHistoryComponent } from './metadata-history.component';
import { MetadataHistory } from '../model/history';
import { MetadataVersion } from '../model/version';
import { MetadataHistoryService } from '../service/history.service';
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
    let fixture: ComponentFixture<MetadataHistoryComponent>;
    let instance: MetadataHistoryComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: MetadataHistoryService, useValue: MockHistoryService
                }
            ],
            imports: [
                MockI18nModule
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
