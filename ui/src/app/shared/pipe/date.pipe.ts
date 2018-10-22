import { PipeTransform, Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'customDate' })
export class CustomDatePipe implements PipeTransform {
    pipe: DatePipe;
    constructor() {
        this.pipe = new DatePipe('en');
    }
    transform(value: string, format: string): string {
        let transformed: string;
        try {
            transformed = this.pipe.transform(value, format);
        } catch (err) {
            transformed = value;
        }
        return transformed;
    }
}
