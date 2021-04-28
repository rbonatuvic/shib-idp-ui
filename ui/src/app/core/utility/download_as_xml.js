import * as FileSaver from 'file-saver';

export const downloadAsXml = (entity, xml) => {
    const name = entity.name ? entity.name : entity.serviceProviderName;
    const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
    FileSaver.saveAs(blob, `${name}.xml`);
}