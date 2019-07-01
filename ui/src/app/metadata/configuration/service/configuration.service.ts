import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Metadata } from '../../domain/domain.type';
import { Wizard } from '../../../wizard/model';
import { MetadataSourceEditor } from '../../domain/model/wizards/metadata-source-editor';
import { MetadataProviderEditorTypes } from '../../provider/model';
import { Schema } from '../model/schema';
import { PATHS } from '../configuration.values';

@Injectable()
export class MetadataConfigurationService {

    readonly base = '/api';

    constructor(
        private http: HttpClient
    ) {}

    find(id: string, type: string): Observable<Metadata> {
        return this.http.get<Metadata>(`${this.base}/${PATHS[type]}/${id}`);
    }

    getDefinition(type: string): Wizard<Metadata> {
        return MetadataProviderEditorTypes.find(def => def.type === type) || new MetadataSourceEditor();
    }

    loadSchema(path: string): Observable<Schema> {
        return this.http.get<Schema>(path);
    }
}

