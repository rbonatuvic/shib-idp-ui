import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class FileServiceStub {
    readAsText(): Observable<string | Blob> {
        let subj = new Subject<string | Blob>();
        subj.next('foo');
        subj.complete();
        return subj.asObservable();
    }
}
