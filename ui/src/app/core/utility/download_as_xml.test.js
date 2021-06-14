import * as FileSaver from 'file-saver';
import { downloadAsXml } from './download_as_xml';
jest.mock('file-saver');

it('attempts to save the provided content', () => {
    const name = 'foo.xml';
    const xml = '<bar></bar>';

    downloadAsXml(name, xml);
    expect(FileSaver.saveAs).toHaveBeenCalled();
});
