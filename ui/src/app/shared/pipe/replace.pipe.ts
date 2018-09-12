import { PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'replace' })
export class ReplacePipe implements PipeTransform {
    constructor(public sanitizer: DomSanitizer) { }
    transform(value: string, query: { [propName: string]: string }): SafeHtml {
        return '';
    }
}
