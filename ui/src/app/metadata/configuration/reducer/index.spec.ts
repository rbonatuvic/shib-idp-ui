import {
    getConfigurationModelNameFn,
    getConfigurationModelEnabledFn,
    getConfigurationModelTypeFn,
    getSelectedVersionNumberFn,
    getSelectedIsCurrentFn
} from './index';

import { Metadata } from '../../domain/domain.type';

describe('Configuration Reducer', () => {

    describe('getConfigurationModelNameFn function', () => {
        it('should return the name attribute', () => {
            expect(getConfigurationModelNameFn({ serviceProviderName: 'foo' } as Metadata)).toBe('foo');
            expect(getConfigurationModelNameFn({ name: 'bar' } as Metadata)).toBe('bar');
            expect(getConfigurationModelNameFn(null)).toBe('');
        });
    });

    describe('getConfigurationModelEnabledFn function', () => {
        it('should return the enabled attribute', () => {
            expect(getConfigurationModelEnabledFn({ serviceEnabled: true } as Metadata)).toBe(true);
            expect(getConfigurationModelEnabledFn({ enabled: true } as Metadata)).toBe(true);
            expect(getConfigurationModelEnabledFn(null)).toBe(false);
        });
    });

    describe('getConfigurationModelTypeFn function ', () => {
        it('should return provider type if the object has an @type property', () => {
            const md = { '@type': 'FilebackedHttpMetadataResolver' } as Metadata;
            expect(getConfigurationModelTypeFn(md)).toBe('FilebackedHttpMetadataResolver');
        });
        it('should return resolver if no type is detected', () => {
            const md = { serviceEnabled: true } as Metadata;
            expect(getConfigurationModelTypeFn(md)).toBe('resolver');
        });
    });

    describe('getSelectedVersionNumberFn function ', () => {
        it('should return the selected version by id', () => {
            const versions = [ { id: 'foo' }, { id: 'bar' } ];
            const id = 'foo';
            expect(getSelectedVersionNumberFn(versions, id)).toBe(1);
        });
    });

    describe('getSelectedIsCurrentFn function ', () => {
        it('should return a boolean of whether the selected version is the most current version', () => {
            const versions = [{ id: 'foo' }, { id: 'bar' }];
            const id = 'foo';
            expect(getSelectedIsCurrentFn(versions[0], versions)).toBe(true);
            expect(getSelectedIsCurrentFn(versions[1], versions)).toBe(false);
        });
    });
});
