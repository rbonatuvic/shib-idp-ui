import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ConfigurationState, getVersionCollection } from '../reducer';
import { MetadataVersion } from '../model/version';

@Component({
    selector: 'metadata-history',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-history.component.html',
    styleUrls: []
})
export class MetadataHistoryComponent {

    history$: Observable<MetadataVersion[]>;

    constructor(
        private store: Store<ConfigurationState>
    ) {
        this.history$ = this.store.select(getVersionCollection);
    }
}
