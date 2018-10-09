import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

@Component({
    selector: 'new-resolver-page',
    templateUrl: './new-resolver.component.html',
    styleUrls: ['./new-resolver.component.scss']
})
export class NewResolverComponent {

    canSetNewType$: Observable<boolean>;

    constructor(
        private route: ActivatedRoute
    ) {
        this.canSetNewType$ = this.route.queryParams.pipe(
            withLatestFrom(this.route.url),
            map(([params, url]) => this.route.snapshot.firstChild.routeConfig.path !== 'blank' || params.index === 'common')
        );
    }
}
