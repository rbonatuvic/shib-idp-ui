import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concat';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MetadataFilter } from '../../domain/model/metadata-filter';

@Injectable()
export class MetadataFilterService {

    constructor(
        private http: HttpClient
    ) { }
    save(provider: MetadataFilter): Observable<MetadataFilter> {
        const saved = {
            ...provider,
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            createdDate: '2018-04-05T09:07:13.730',
            updatedDate: '2018-04-05T09:07:13.730'
        };
        return Observable.of(saved);
    }
}
