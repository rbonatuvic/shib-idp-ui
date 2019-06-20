import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MetadataHistory } from '../model/history';

import { PATHS } from '../../configuration/configuration.values';
import { MetadataVersion } from '../model/version';
import { map } from 'rxjs/operators';

@Injectable()
export class MetadataHistoryService {

    readonly base = `api`;
    readonly path = `Versions`;

    constructor(
        private http: HttpClient
    ) { }

    query(resourceId: string, type: string): Observable<MetadataHistory> {
        return this.http.get<MetadataVersion[]>(`/${this.base}/${PATHS[type]}/${resourceId}/${this.path}`).pipe(
            map(resp => ({
                versions: resp
            }))
        );
    }
}
