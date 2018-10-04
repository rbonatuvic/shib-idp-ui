import { InjectionToken } from '@angular/core';
import { Wizard } from '../../wizard/model';
import { MetadataResolver } from '../domain/model';

export const METADATA_SOURCE_WIZARD = new InjectionToken<Wizard<MetadataResolver>>('METADATA_SOURCE_WIZARD');
