import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { UploadResolverComponent } from './upload-resolver.component';
import { FileService } from '../../../core/service/file.service';
import { FileServiceStub } from '../../../../testing/file.service.stub';
import * as fromResolver from '../reducer';
import { MockI18nModule } from '../../../../testing/i18n.stub';

@Component({
    template: `<upload-resolver-form
                (upload)="upload($event)"
                (fromUrl)="createFromUrl($event)"></upload-resolver-form>`
})
class TestHostComponent {
    @ViewChild(UploadResolverComponent, {static: true})
    public formUnderTest: UploadResolverComponent;

    upload(event: Event): void {}
    createFromUrl(event: Event): void {}
}

const getFakeFile = (str: string) => {
    let blob = new Blob([str], { type: 'text/html' });
    blob['lastModifiedDate'] = '';
    blob['name'] = str;
    return <File>blob;
};

describe('Upload Resolver Page', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let form: UploadResolverComponent;
    let fileService: FileServiceStub;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: FileService, useClass: FileServiceStub }
            ],
            imports: [
                ReactiveFormsModule,
                StoreModule.forRoot(fromResolver.reducers),
                MockI18nModule
            ],
            declarations: [
                UploadResolverComponent,
                TestHostComponent
            ],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
        form = instance.formUnderTest;
        fileService = TestBed.get(FileService);
        fixture.detectChanges();
    });

    it('should compile', () => {
        fixture.detectChanges();
        expect(form).toBeDefined();
    });

    describe('save method', () => {
        it('should call the upload method with the selected file when one is defined', () => {
            fixture.detectChanges();
            form.file = getFakeFile('foo');
            spyOn(form, 'saveFromFile');
            form.save();
            expect(form.saveFromFile).toHaveBeenCalled();
        });
        it('should call the fromUrl method when there is no file selected', () => {
            fixture.detectChanges();
            spyOn(form, 'saveFromFile');
            spyOn(form, 'saveFromUrl');
            form.save();
            expect(form.saveFromUrl).toHaveBeenCalled();
            expect(form.saveFromFile).not.toHaveBeenCalled();
        });
    });

    describe('saveFromFile method', () => {
        it('should retrieve the file text from a service and call the provided upload emitter', waitForAsync((done) => {
            fixture.detectChanges();
            spyOn(fileService, 'readAsText').and.callFake(() => of('foo'));
            form.providerForm.setValue({ serviceProviderName: 'foo', file: '', url: '' });
            form.saveFromFile(getFakeFile('foo'), 'foo');
            form.upload.subscribe(v => {
                expect(v).toEqual({
                    name: 'foo',
                    body: 'foo'
                });
                done();
            });
        }));
    });

    describe('saveFromUrl method', () => {
        it('should retrieve the file text from a service and call the provided upload emitter', waitForAsync((done) => {
            fixture.detectChanges();
            form.saveFromUrl({ serviceProviderName: 'foo', url: 'foo.bar' });
            form.fromUrl.subscribe(v => {
                expect(v).toEqual({
                    name: 'foo',
                    url: 'foo.bar'
                });
                done();
            });
        }));
    });

    describe('fileChange method', () => {
        it('should set the reactive form value based on the provided event', waitForAsync((done) => {
            let evt = {
                target: {
                    files: [{name: 'foo'}]
                }
            };
            form.fileChange(evt);
            fixture.detectChanges();
            expect(form.file).toBeDefined();
            expect(form.providerForm.get('file').value).toBe('foo');
        }));

        it('should do nothing if no file is selected', waitForAsync((done) => {
            let evt = {
                target: {
                    files: []
                }
            };
            form.fileChange(evt);
            fixture.detectChanges();
            expect(form.file).not.toBeDefined();
            expect(form.providerForm.get('file').value).toBe('');
        }));
    });
});
