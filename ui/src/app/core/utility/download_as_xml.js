import * as FileSaver from 'file-saver';

export const downloadAsXml = (fileName, xml) => {
    const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
    FileSaver.saveAs(blob, `${fileName}.xml`);
}