import { Component, Input, EventEmitter, ChangeDetectionStrategy, Output } from '@angular/core';
import { MetadataHistory } from '../model/history';
import { MetadataVersion } from '../model/version';

@Component({
    selector: 'history-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './history-list.component.html',
    styleUrls: []
})
export class HistoryListComponent {
    @Input() history: MetadataVersion[];
    @Output() compare: EventEmitter<MetadataVersion[]> = new EventEmitter();
    @Output() restore: EventEmitter<MetadataVersion> = new EventEmitter();

    selected: MetadataVersion[] = [];

    constructor() {}

    toggleVersionSelected(version: MetadataVersion): void {
        if (this.selected.indexOf(version) > -1) {
            this.selected = this.selected.filter(s => s !== version);
        } else {
            this.selected = [...this.selected, version];
        }
    }

    compareSelected(selected: MetadataVersion[]): void {
        this.compare.emit(selected);
    }

    restoreVersion(version: MetadataVersion): void {
        this.restore.emit(version);
    }
}
