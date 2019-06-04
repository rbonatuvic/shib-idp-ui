import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MetadataHistory } from '../model/history';


@Injectable()
export class HistoryService {

    readonly base = '/api';

    constructor(
        private http: HttpClient
    ) { }

    query(): Observable<MetadataHistory> {
        return of({
            versions: [
                {
                    versionNumber: 1,
                    saveDate: new Date(),
                    changedBy: 'admin',
                    actions: []
                },
                {
                    versionNumber: 2,
                    saveDate: new Date(),
                    changedBy: 'admin',
                    actions: ['restore']
                }
            ]
        });
    }
}
