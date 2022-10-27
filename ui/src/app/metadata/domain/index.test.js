import { NameIDFilterEditor } from './filter/definition/NameIdFilterDefinition';
import { getDefinition } from './index';
import { FileSystemMetadataProviderEditor } from './provider/definition/FileSystemMetadataProviderDefinition';
import { OidcSourceEditor } from './source/definition/OidcSourceDefinition';

jest.mock('../../App.constant', () => ({
    get API_BASE_PATH() {
        return '/';
    }
}));

describe('getDefinitions method', () => {
    it('should retrieve the definition', () => {
        expect(getDefinition('OIDC')).toBe(OidcSourceEditor);
        expect(getDefinition('NameIDFormat')).toBe(NameIDFilterEditor);
        expect(getDefinition('FilesystemMetadataResolver')).toBe(FileSystemMetadataProviderEditor);
    });
});