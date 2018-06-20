import { PrettyXml } from './pretty-xml.pipe';
import * as XmlFormatter from 'xml-formatter';

describe('Pipe: Pretty Xml', () => {
    let pipe: PrettyXml;

    beforeEach(() => {
        pipe = new PrettyXml();
    });

    it('should return the formatted xml', () => {
        const str = '<foobar><foo></foo><bar></bar></foobar>';
        expect(pipe.transform(str)).toEqual(XmlFormatter(str));
    });

    it('should return the provided string if not truthy', () => {
        const str = '';
        expect(pipe.transform(str)).toEqual('');
    });
});
