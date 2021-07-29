import { NameIDFilterEditor } from './filter/definition/NameIdFilterDefinition';
import { getDefinition } from './index';
import { FileSystemMetadataProviderEditor } from './provider/definition/FileSystemMetadataProviderDefinition';
import { SourceEditor } from './source/definition/SourceDefinition';

describe('getDefinitions method', () => {
    it('should retrieve the definition', () => {
        expect(getDefinition('source')).toBe(SourceEditor);
        expect(getDefinition('NameIDFormat')).toBe(NameIDFilterEditor);
        expect(getDefinition('FilesystemMetadataResolver')).toBe(FileSystemMetadataProviderEditor);
    });
});