import {
    Component,
    Input,
    OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import { I18nService } from '../service/i18n.service';
import * as fromI18n from '../reducer';
import { Store } from '@ngrx/store';
import { Messages } from '../model/Messages';

/*tslint:disable:component-selector */

@Component({
    selector: 'translate-i18n',
    template: `
        <ng-container>
            <ng-content *ngIf="!translated"></ng-content>
            <ng-container>{{ translated }}</ng-container>
        </ng-container>
    `
})
export class TranslateComponent implements OnDestroy {
    private _key: string;
    lastParams: any;
    currentParams: any;
    messages: Messages = {};
    sub: Subscription;
    default: string;
    translated: string;

    @Input() set key(key: string) {
        if (key) {
            this.default = this.default || this._key;
            this._key = key;
            this.update();
        }
    }

    @Input() set params(params: any) {
        this.currentParams = params || {};
        this.update();
    }

    constructor(
        private service: I18nService,
        private store: Store<fromI18n.State>
    ) {
        this.sub = this.store.select(fromI18n.getMessages).subscribe(m => {
            if (m && Object.keys(m).length) {
                this.messages = m;
                this.update();
            }
        });
    }

    update(): void {
        this.translated = this.service.translate(this._key, this.currentParams, this.messages);
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
