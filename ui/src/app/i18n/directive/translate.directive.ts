import {
    AfterViewChecked,
    ChangeDetectorRef,
    Directive,
    ElementRef,
    Input,
    OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import { I18nService } from '../service/i18n.service';
import * as fromI18n from '../reducer';
import { Store } from '@ngrx/store';
import { Messages } from '../model/Messages';

@Directive({
    selector: '[translate]'
})
export class TranslateDirective implements OnDestroy {
    key: string;
    lastParams: any;
    currentParams: any;
    messages: Messages;
    sub: Subscription;

    @Input() set translate(key: string) {
        if (key) {
            this.key = key;
            this.update();
        }
    }

    @Input() set translateParams(params: any) {
        this.currentParams = params || {};
        this.update();
    }

    constructor(
        private service: I18nService,
        private store: Store<fromI18n.State>,
        private element: ElementRef,
        private _ref: ChangeDetectorRef
    ) {
        this.sub = this.store.select(fromI18n.getMessages).subscribe(m => this.messages = m);
    }

    update(): void {
        this.element.nativeElement.textContent = this.service.translate(this.key, this.currentParams, this.messages);
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
