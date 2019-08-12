import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { MetadataHistory } from '../model/history';

import { PATHS } from '../../configuration/configuration.values';
import { MetadataVersion } from '../model/version';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Metadata } from '../../domain/domain.type';
import { withLatestFrom } from 'rxjs-compat/operator/withLatestFrom';

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

    getVersions(resourceId: string, versions: string[], type: string): Observable<Metadata[]> {
        return forkJoin(versions.map(
            v => this.getVersion(resourceId, type, v)
        ));
    }

    getVersion(resourceId: string, type: string, versionId?: string): Observable<Metadata> {
        const api = versionId ?
            `/${this.base}/${PATHS[type]}/${resourceId}/${this.path}/${versionId}`
            :
            `/${this.base}/${PATHS[type]}/${resourceId}`;
        return this.http.get<Metadata>(api);
    }

    updateVersion(resourceId: string, type: string, model: Metadata): Observable<Metadata> {
        return this.http.put<Metadata>(`/${this.base}/${PATHS[type]}/${resourceId}`, model);
    }

    restoreVersion(resourceId: string, type: string, versionId: string): Observable<Metadata> {
        return this.getVersions(resourceId, [null, versionId], type).pipe(
            switchMap(([current, toRestore]) =>
                this.updateVersion(resourceId, type, { ...toRestore, version: current.version })
            )
        );
    }
}
