import * as FileSaver from 'file-saver';

export const downloadAsZip = (fileName, data) => {
    // const blob = new Blob([data], { type: 'text/zip;charset=utf-8' });
    FileSaver.saveAs(data, `${fileName}.zip`);
}

export const downloadAsXml = (fileName, xml) => {
    const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
    FileSaver.saveAs(blob, `${fileName}.xml`);
}
