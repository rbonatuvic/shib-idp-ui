import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { WizardSummaryComponent } from './wizard-summary.component';
import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from 'ngx-schema-form';
import { Wizard } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';
import { SummaryPropertyComponent } from './summary-property.component';
import { SCHEMA } from '../../../../testing/form-schema.stub';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { MetadataProviderWizard } from '../../provider/model';

@Component({
    template: `
        <wizard-summary [summary]="summary"></wizard-summary>
    `
})
class TestHostComponent {
    @ViewChild(WizardSummaryComponent)
    public componentUnderTest: WizardSummaryComponent;

    private _summary;

    get summary(): { definition: Wizard<MetadataProvider>, schema: { [id: string]: any }, model: any } {
        return this._summary;
    }

    set summary(summary: { definition: Wizard<MetadataProvider>, schema: { [id: string]: any }, model: any }) {
        this._summary = summary;
    }
}

describe('Provider Wizard Summary Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: WizardSummaryComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbDropdownModule,
                NgbPopoverModule,
                RouterTestingModule,
                SchemaFormModule.forRoot(),
                MockI18nModule
            ],
            declarations: [
                WizardSummaryComponent,
                SummaryPropertyComponent,
                TestHostComponent
            ],
            providers: [
                { provide: WidgetRegistry, useClass: DefaultWidgetRegistry }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should instantiate the component', async(() => {
        expect(app).toBeTruthy();
    }));

    describe('gotoPage function', () => {
        it('should emit an empty string if page is null', () => {
            spyOn(app.onPageSelect, 'emit');
            app.gotoPage();
            expect(app.onPageSelect.emit).toHaveBeenCalledWith('');
        });

        it('should emit the provided page', () => {
            spyOn(app.onPageSelect, 'emit');
            app.gotoPage('foo');
            expect(app.onPageSelect.emit).toHaveBeenCalledWith('foo');
        });
    });

    describe('ngOnChanges', () => {
        it('should set columns and sections if summary is provided', () => {
            instance.summary = {
                model: {
                    name: 'foo',
                    '@type': 'MetadataProvider'
                },
                schema: SCHEMA,
                definition: MetadataProviderWizard
            };
            fixture.detectChanges();
            expect(app.sections).toBeDefined();
            expect(app.columns).toBeDefined();
        });
    });
});
