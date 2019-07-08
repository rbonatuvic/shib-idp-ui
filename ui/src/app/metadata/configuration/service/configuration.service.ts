import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Metadata } from '../../domain/domain.type';
import { Wizard } from '../../../wizard/model';
import { MetadataSourceEditor } from '../../domain/model/wizards/metadata-source-editor';
import { MetadataProviderEditorTypes } from '../../provider/model';
import { Schema } from '../model/schema';
import { TYPES } from '../configuration.values';
import { ResolverService } from '../../domain/service/resolver.service';

@Injectable()
export class MetadataConfigurationService {

    constructor(
        private resolverService: ResolverService,
        private http: HttpClient
    ) {}

    find(id: string, type: string): Observable<Metadata> {
        switch (type) {
            case TYPES.resolver:
                return this.resolverService.find(id);
            default:
                return throwError(new Error('Type not supported'));
        }
    }

    getDefinition(type: string): Wizard<Metadata> {
        return MetadataProviderEditorTypes.find(def => def.type === type) || new MetadataSourceEditor();
    }

    loadSchema(path: string): Observable<Schema> {
        return this.http.get<Schema>(path);
    }
}

