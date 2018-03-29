import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concat';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';

@Injectable()
export class MetadataFilterService {

    constructor(
        private http: HttpClient
    ) { }
    save(provider: MetadataProvider): Observable<MetadataProvider> {
        const saved = { ...provider, id: Date.now() + '_' + Math.random().toString(36).substr(2, 9) };
        return Observable.of(saved);
    }
}
