import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { FileService } from '../../../core/service/file.service';
import * as fromResolver from '../reducer';
import { UploadResolverRequest, CreateResolverFromUrlRequest } from '../action/collection.action';

@Component({
    selector: 'upload-resolver-form',
    templateUrl: './upload-resolver.component.html'
})
export class UploadResolverComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    @Output() upload: EventEmitter<any> = new EventEmitter();
    @Output() fromUrl: EventEmitter<any> = new EventEmitter();

    providerForm: FormGroup;
    formValue: any;

    file: File;

    constructor(
        private fb: FormBuilder,
        private fileService: FileService,
        private store: Store<fromResolver.State>
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

        this.providerForm.get('file').valueChanges.pipe(
            takeUntil(this.ngUnsubscribe),
            debounceTime(100)
        ).subscribe(changes => {
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
            this.store.dispatch(new UploadResolverRequest({
                name: name,
                body: txt as string
            }));
        });
    }

    saveFromUrl(values: {serviceProviderName: string, url: string}): void {
        this.store.dispatch(new CreateResolverFromUrlRequest({
            name: values.serviceProviderName,
            url: values.url
        }));
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
