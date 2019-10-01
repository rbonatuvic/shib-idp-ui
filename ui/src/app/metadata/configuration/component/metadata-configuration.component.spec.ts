import { Component, ViewChild, Input } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MetadataConfigurationComponent } from './metadata-configuration.component';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MetadataConfiguration } from '../model/metadata-configuration';
import { Property } from '../../domain/model/property';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { Router } from '@angular/router';

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
    let router: Router;

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
        router = TestBed.get(Router);
        fixture.detectChanges();
    }));

    it('should accept a configuration input', async(() => {
        expect(app).toBeTruthy();
    }));

    describe('edit method', () => {
        it('should call onEdit.emit', () => {
            spyOn(app.onEdit, 'emit');
            app.edit('foo');
            expect(app.onEdit.emit).toHaveBeenCalled();
        });
    });

    describe('width getter', () => {
        it('should default to 100%', () => {
            expect(app.width).toBe('100%');
        });
        it('should calculate the width based on dates', () => {
            instance.configuration = {
                ...instance.configuration,
                dates: [
                    new Date().toISOString(),
                    new Date().toISOString()
                ]
            };
            fixture.detectChanges();
            expect(app.width).toBe('33%');
        });
    });
});
