import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import * as fromConfiguration from '../reducer';
import { Metadata } from '../../domain/domain.type';
import { DownloadXml } from '../action/configuration.action';

@Component({
    selector: 'metadata-xml-page',
    templateUrl: './metadata-xml.component.html',
    styleUrls: []
})
export class MetadataXmlComponent {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    entity: Metadata;
    entity$: Observable<Metadata>;
    xml: string;
    xml$: Observable<string>;

    constructor(
        private store: Store<fromConfiguration.ConfigurationState>
    ) {
        this.xml$ = this.store.select(fromConfiguration.getConfigurationXml);
        this.entity$ = this.store.select(fromConfiguration.getConfigurationModel);
    }

    preview(): void {
        this.store.dispatch(new DownloadXml());
    }
}
