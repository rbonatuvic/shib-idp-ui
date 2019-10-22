import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class FileService {

    getLoader(sub: Subject<string | ArrayBuffer>): any {
        return (evt) => {
            const reader = evt.target as FileReader;
            const txt = reader.result;
            sub.next(txt);
            sub.complete();
        };
    }
    readAsText(file: File): Observable<string | ArrayBuffer> {
        let sub = new Subject<string | ArrayBuffer>(),
            fileReader = new FileReader();
        fileReader.onload = this.getLoader(sub);
        fileReader.readAsText(file);
        return sub.asObservable();
    }
} /* istanbul ignore next */
