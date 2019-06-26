import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MockI18nModule } from '../../../../testing/i18n.stub';
import { MetadataVersion } from '../model/version';
import { MetadataHeaderComponent } from './metadata-header.component';

@Component({
    template: `
        <metadata-header
            [isEnabled]="isEnabled"
            [version]="version"
            [versionNumber]="versionNumber"
            [isCurrent]="isCurrent"
            ></metadata-header>
    `
})
class TestHostComponent {
    @ViewChild(MetadataHeaderComponent)
    public componentUnderTest: MetadataHeaderComponent;

    isEnabled = true;

    version: MetadataVersion = {
        id: 'foo',
        creator: 'foobar',
        date: new Date().toDateString()
    };
    versionNumber = 1;
    isCurrent = false;
}

describe('Metadata Header Component', () => {

    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let app: MetadataHeaderComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MockI18nModule
            ],
            declarations: [
                MetadataHeaderComponent,
                TestHostComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        app = instance.componentUnderTest;
        fixture.detectChanges();
    }));

    it('should accept a property input', async(() => {
        expect(app).toBeTruthy();
    }));
});
