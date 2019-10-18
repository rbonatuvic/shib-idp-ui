import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { HistoryListComponent } from './history-list.component';
import { MetadataHistory } from '../model/history';
import { MetadataVersion } from '../model/version';
import { RouterTestingModule } from '@angular/router/testing';

export const TestData = {
    versions: [
        {
            id: 'foo',
            date: new Date().toDateString(),
            creator: 'admin'
        }
    ]
};

@Component({
    template: `<history-list [history]="history.versions" (compare)="compare($event)" (restore)="restore($event)"></history-list>`
})
class TestHostComponent {
    @ViewChild(HistoryListComponent, {static: true})
    public componentUnderTest: HistoryListComponent;

    history: MetadataHistory = TestData;

    compare(versions: MetadataVersion[]): void {}
    restore(version: MetadataVersion): void {}
}

describe('Metadata History List Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let list: HistoryListComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                MockI18nModule,
                RouterTestingModule
            ],
            declarations: [
                HistoryListComponent,
                TestHostComponent
            ],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        list = instance.componentUnderTest;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(list).toBeDefined();
    });

    describe('compare selected', () => {
        it('should allow the user to toggle selected versions for comparison', () => {
            list.toggleVersionSelected(TestData.versions[0]);
            expect(list.selected.length).toBe(1);
        });

        it('should emit an event with the selected values when the Compare Selected button is clicked', () => {
            spyOn(instance, 'compare');
            const selected = TestData.versions;
            list.compareSelected(selected);
            fixture.detectChanges();
            expect(instance.compare).toHaveBeenCalledWith(selected);
        });
    });

    describe('restore', () => {
        it('should emit an event with the selected version when the Restore button is clicked', () => {
            spyOn(instance, 'restore');
            const selected = TestData.versions[0];
            list.restoreVersion(selected);
            fixture.detectChanges();
            expect(instance.restore).toHaveBeenCalledWith(selected);
        });
    });

    describe('toggleVersionSelected method', () => {
        it('should add or remove the selected version', () => {
            list.toggleVersionSelected(TestData.versions[0]);
            fixture.detectChanges();
            list.toggleVersionSelected(TestData.versions[0]);
            fixture.detectChanges();
            expect(list.selected.length).toBe(0);
        });
    });
});
