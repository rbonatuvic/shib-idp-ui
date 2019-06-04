import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MetadataHistory } from '../model/history';
import { HistoryService } from '../service/history.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'version-history',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './version-history.component.html',
    styleUrls: []
})
export class VersionHistoryComponent {

    history$: Observable<MetadataHistory>;

    constructor(
        private historyService: HistoryService
    ) {
        this.history$ = this.historyService.query();
    }
}
