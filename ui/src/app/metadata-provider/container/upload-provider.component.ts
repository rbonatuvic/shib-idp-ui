import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormControlName, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { EntityValidators } from '../../domain/service/entity-validators.service';
import { FileService } from '../../core/service/file.service';

@Component({
    selector: 'upload-provider-form',
    templateUrl: './upload-provider.component.html'
})
export class UploadProviderComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    @Output() upload: EventEmitter<any> = new EventEmitter();
    @Output() fromUrl: EventEmitter<any> = new EventEmitter();

    providerForm: FormGroup;
    formValue: any;

    file: File;

    constructor(
        private fb: FormBuilder,
        private fileService: FileService
    ) {}

    ngOnInit(): void {
        this.providerForm = this.fb.group({
            serviceProviderName: ['', Validators.required],
            file: [''],
            url: ['']
        });

        this.providerForm.valueChanges.subscribe(changes => {
            this.formValue = changes;
        });

        this.providerForm
            .get('file')
            .valueChanges
            .takeUntil(this.ngUnsubscribe)
            .debounceTime(100)
            .subscribe(changes => {
                let url = this.providerForm.get('url');
                url[changes ? 'disable' : 'enable']();
                if (!!url.value) {
                    url.setValue(null);
                }
            });
    }

    save(): void {
        let file = this.file;
        if (file) {
            this.saveFromFile(file, this.providerForm.get('serviceProviderName').value);
        } else {
            this.saveFromUrl(this.providerForm.value);
        }
    }

    saveFromFile(file: File, name: string): void {
        this.fileService.readAsText(file).subscribe(txt => {
            this.upload.emit({
                name: name,
                body: txt
            });
        });
    }

    saveFromUrl(values: {serviceProviderName: string, url: string}): void {
        this.fromUrl.emit({
            name: values.serviceProviderName,
            url: values.url
        });
    }

    fileChange($event): void {
        let fileList = $event.target.files,
            file = fileList[0];
        this.file = file;
        if (file) {
            this.providerForm.get('file').setValue(file.name);
            this.providerForm.updateValueAndValidity();
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
} /* istanbul ignore next */
