import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { PreviewDialogComponent } from './preview-dialog.component';

@NgModule({
    declarations: [
        PreviewDialogComponent
    ],
    entryComponents: [
        PreviewDialogComponent
    ],
    imports: [
        NgbModalModule,
        CommonModule
    ],
    providers: []
})
export class PreviewDialogModule { }
