import { NameIDFilterEditor } from './filter/NameIdFilterDefinition';
import { getDefinition } from './index';
import { FileSystemMetadataProviderEditor } from './provider/FileSystemMetadataProviderDefinition';
import { SourceEditor } from './source/SourceDefinition';

describe('getDefinitions method', () => {
    it('should retrieve the definition', () => {
        expect(getDefinition('source')).toBe(SourceEditor);
        expect(getDefinition('NameIDFormat')).toBe(NameIDFilterEditor);
        expect(getDefinition('FilesystemMetadataResolver')).toBe(FileSystemMetadataProviderEditor);
    });
});