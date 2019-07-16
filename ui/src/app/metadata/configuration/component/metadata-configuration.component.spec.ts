import { Component, ViewChild, Input } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MetadataConfigurationComponent } from './metadata-configuration.component';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { Property } from '../../domain/model/property';
import { MockI18nModule } from '../../../../testing/i18n.stub';

@Component({
    selector: 'object-property',
    template: ``
})
class ObjectPropertyComponent {
    @Input() property: Property;
    @Input() columns = 1;
}

@Component({
    template: `
        <metadata-configuration [configuration]="configuration"></metadata-configuration>
    `
})
class TestHostComponent {
    @ViewChild(MetadataConfigurationComponent)
    public componentUnderTest: MetadataConfigurationComponent;

    configuration: MetadataConfiguration = {
        dates: [],
        sections: []
    };
}

describe('Metadata Configuration Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: MetadataConfigurationComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                MockI18nModule,
                RouterTestingModule
            ],
            declarations: [
                MetadataConfigurationComponent,
                ObjectPropertyComponent,
                TestHostComponent
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should accept a configuration input', async(() => {
        expect(app).toBeTruthy();
    }));
});
