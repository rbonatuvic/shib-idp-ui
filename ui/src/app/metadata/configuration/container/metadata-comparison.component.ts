import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ConfigurationState, getVersionCollection } from '../reducer';
import { Metadata } from '../../domain/domain.type';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'metadata-comparison',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-comparison.component.html',
    styleUrls: []
})
export class MetadataComparisonComponent {

    versions$: Observable<Metadata[]>;

    constructor(
        private store: Store<ConfigurationState>,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams.subscribe(versions => console.log(versions));
    }
}
