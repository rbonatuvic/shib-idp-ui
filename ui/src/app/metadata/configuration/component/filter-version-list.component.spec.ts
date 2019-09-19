import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockI18nModule } from '../../../../testing/i18n.stub';
import { FilterVersionListComponent } from './filter-version-list.component';
import { FilterComparison } from '../model/compare';
import { FilterConfiguration } from '../model/metadata-configuration';

export const TestData = {
    dates: ['abc', '123'],
    filters: [
        {
            resourceId: 'foo',
            name: 'Test 1',
            type: 'EntityAttributesFilter',
            comparable: false
        },
        {
            resourceId: 'bar',
            name: 'Test 2',
            type: 'EntityAttributesFilter',
            comparable: false
        }
    ]
};

@Component({
    template: `
    <filter-version-list
        [filters]="filters"
        (compare)="compare($event)">
    </filter-version-list>
    `
})
class TestHostComponent {
    @ViewChild(FilterVersionListComponent)
    public componentUnderTest: FilterVersionListComponent;

    filters: FilterConfiguration = TestData;

    compare(versions: FilterComparison): void { }
}

describe('Filter Version List Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let list: FilterVersionListComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
            imports: [
                MockI18nModule,
                RouterTestingModule
            ],
            declarations: [
                FilterVersionListComponent,
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

    /*
    describe('compareSelected', () => {
        it('should emit an event with the selected filter data', () => {
            list.selected = 'foo';
            fixture.detectChanges();
            spyOn(instance, 'compare');
            list.compareSelected();
            fixture.detectChanges();
            expect(instance.compare).toHaveBeenCalled();
        });
    });
    */
});
