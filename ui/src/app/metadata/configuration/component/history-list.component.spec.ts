import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { HistoryListComponent } from './history-list.component';
import { MetadataHistory } from '../model/history';
import { MetadataVersion } from '../model/version';

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
    template: `<history-list [history]="history" (compare)="compare($event)" (restore)="restore($event)"></history-list>`
})
class TestHostComponent {
    @ViewChild(HistoryListComponent)
    public componentUnderTest: HistoryListComponent;

    history: MetadataHistory = TestData;

    compare(versions: MetadataVersion[]): void {}
    restore(version: MetadataVersion): void {}
}

describe('Metadata History List Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let table: HistoryListComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                MockI18nModule
            ],
            declarations: [
                HistoryListComponent,
                TestHostComponent
            ],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        table = instance.componentUnderTest;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(table).toBeDefined();
    });

    describe('compare selected', () => {
        it('should allow the user to toggle selected versions for comparison', () => {
            table.toggleVersionSelected(TestData.versions[0]);
            expect(table.selected.length).toBe(1);
        });

        it('should emit an event with the selected values when the Compare Selected button is clicked', () => {
            spyOn(instance, 'compare');
            const selected = TestData.versions;
            table.compareSelected(selected);
            fixture.detectChanges();
            expect(instance.compare).toHaveBeenCalledWith(selected);
        });

        it('should emit an event with the selected version when the Restore button is clicked', () => {
            spyOn(instance, 'restore');
            const selected = TestData.versions[0];
            table.restoreVersion(selected);
            fixture.detectChanges();
            expect(instance.restore).toHaveBeenCalledWith(selected);
        });
    });
});
