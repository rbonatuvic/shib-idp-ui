import { getConfigurationSectionsFn } from './index';
import { SCHEMA as schema } from '../../../../testing/form-schema.stub';
import { MetadataSourceEditor } from '../../domain/model/wizards/metadata-source-editor';

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
});
