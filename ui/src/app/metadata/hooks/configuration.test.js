import SCHEMA from '../../../testing/dynamic-http.schema';
import { DynamicHttpMetadataProviderEditor } from '../domain/provider/definition/DynamicHttpMetadataProviderDefinition';

import {
    useMetadataConfiguration
} from './configuration';

jest.mock('../../App.constant', () => ({
    get API_BASE_PATH() {
        return '/';
    }
}));

describe('useMetadataConfiguration hook', () => {
    it('should return an empty object if any parameters are not supplied', () => {
        expect(useMetadataConfiguration(null, {}, {})).toEqual({});
        expect(useMetadataConfiguration({}, null, {})).toEqual({});
        expect(useMetadataConfiguration({}, {}, null)).toEqual({});
    });

    it('should return a configuration object', () => {
        const config = useMetadataConfiguration([], SCHEMA, DynamicHttpMetadataProviderEditor);
        expect(config.dates.length).toBe(0);
        expect(config.sections.length).toEqual(4);
        expect(config.sections[0].differences).toBe(false)
    });

    it('should return a configuration object limited to differences', () => {
        const config = useMetadataConfiguration([{ name: 'foo', modifiedDate: '2012-1-1' }, { name: 'bar', modifiedDate: '2012-1-2'}], SCHEMA, DynamicHttpMetadataProviderEditor, true);
        expect(config.dates.length).toBe(2);
        expect(config.sections.length).toEqual(4);
        expect(config.sections[0].differences).toBe(true)
    });
});