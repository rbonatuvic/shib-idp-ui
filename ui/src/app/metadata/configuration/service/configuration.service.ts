import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Metadata } from '../../domain/domain.type';
import { Wizard } from '../../../wizard/model';
import { MetadataSourceEditor } from '../../domain/model/wizards/metadata-source-editor';
import { MetadataProviderEditorTypes } from '../../provider/model';

export enum PATHS {
    resolver = 'EntityDescriptor',
    provider = 'MetadataResolvers'
}

export const DEFINITIONS = {
    resolver: MetadataSourceEditor
};

@Injectable()
export class MetadataConfigurationService {

    readonly base = '/api';

    constructor(
        private http: HttpClient
    ) {}

    find(id: string, type: string): Observable<Metadata> {
        return this.http.get<Metadata>(`${this.base}/${PATHS[type]}/${id}`);
    }

    getDefinition(model: Metadata): Wizard<Metadata> {
        return MetadataProviderEditorTypes.find(def => def.type === model['@type']) || new MetadataSourceEditor();
    }
}

