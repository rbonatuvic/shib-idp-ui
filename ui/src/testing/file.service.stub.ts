import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

export class FileServiceStub {
    readAsText(): Observable<string | Blob> {
        let subj = new Subject<string | Blob>();
        subj.next('foo');
        subj.complete();
        return subj.asObservable();
    }
}
