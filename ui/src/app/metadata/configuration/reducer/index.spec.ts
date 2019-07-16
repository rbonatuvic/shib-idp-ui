import {
    getConfigurationSectionsFn,
    getConfigurationModelNameFn,
    getConfigurationModelEnabledFn
} from './index';
import { SCHEMA as schema } from '../../../../testing/form-schema.stub';
import { MetadataSourceEditor } from '../../domain/model/wizards/metadata-source-editor';
import { Metadata } from '../../domain/domain.type';

describe('Configuration Reducer', () => {
    const model = {
        name: 'foo',
        '@type': 'MetadataResolver'
    };

    const definition = new MetadataSourceEditor();

    describe('getConfigurationSectionsFn', () => {
        it('should parse the schema, definition, and model into a MetadataConfiguration', () => {
            const config = getConfigurationSectionsFn([model], definition, schema);
            expect(config.sections).toBeDefined();
        });
    });

    describe('getConfigurationModelNameFn function', () => {
        it('should return the name attribute', () => {
            expect(getConfigurationModelNameFn({ serviceProviderName: 'foo' } as Metadata)).toBe('foo');
            expect(getConfigurationModelNameFn({ name: 'bar' } as Metadata)).toBe('bar');
            expect(getConfigurationModelNameFn(null)).toBe(false);
        });
    });

    describe('getConfigurationModelEnabledFn function', () => {
        it('should return the name attribute', () => {
            expect(getConfigurationModelEnabledFn({ serviceEnabled: true } as Metadata)).toBe(true);
            expect(getConfigurationModelEnabledFn({ enabled: true } as Metadata)).toBe(true);
            expect(getConfigurationModelEnabledFn(null)).toBe(false);
        });
    });
});
