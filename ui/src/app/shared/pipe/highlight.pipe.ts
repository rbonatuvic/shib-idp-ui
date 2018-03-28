import { PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
    constructor(public sanitizer: DomSanitizer) {}
    transform(value: string, query: string): SafeHtml {
        if (!query || !value) {
            return value;
        }
        let pattern = query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        pattern = pattern.split(' ').filter((t) => {
            return t.length > 0;
        }).join('|');
        const regex = new RegExp(pattern, 'gi');
        return this.sanitizer.bypassSecurityTrustHtml(
            value.replace(regex, (match) => `<span class="font-weight-bold">${match}</span>`)
        );
    }
}
