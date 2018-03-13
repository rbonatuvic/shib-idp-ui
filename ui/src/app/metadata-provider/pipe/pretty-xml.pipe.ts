import { Pipe, PipeTransform } from '@angular/core';
import * as XmlFormatter from 'xml-formatter';

@Pipe({ name: 'prettyXml' })
export class PretttyXml implements PipeTransform {
    transform(value: string): string {
        console.log(XmlFormatter);
        if (!value) {
            return value;
        }
        return XmlFormatter(value);
    }
} /* istanbul ignore next */
