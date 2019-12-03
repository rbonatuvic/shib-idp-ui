import { Injectable } from '@angular/core';
import { DifferentialService } from '../../core/service/differential.service';
import { ContentionEntity, ChangeItem } from '../model/contention';
import { removeNulls } from '../../shared/util';

@Injectable()
export class ContentionService {

    filterKeys = (key => (['version', 'modifiedDate', 'createdDate', 'createdBy', 'modifiedBy', 'audId'].indexOf(key) === -1));

    constructor(
        private diffService: DifferentialService
    ) { }

    getContention(base, ours, theirs, handlers): ContentionEntity<any> {
        let entity = new ContentionEntity<any>(base, ours, theirs, handlers);

        let theirDiff = this.diffService.updatedDiff(base, theirs);
        let ourDiff = this.diffService.updatedDiff(base, removeNulls(ours));
        let ourKeys = Object.keys(ourDiff).filter(this.filterKeys);
        let theirKeys = Object.keys(theirDiff).filter(this.filterKeys);

        entity.ourChanges = ourKeys.map(key => this.getChangeItem(key, ours));
        entity.theirChanges = theirKeys.map(key => this.getChangeItem(key, theirs, ourKeys));

        return entity;
    }

    getChangeItem(key, collection, compare: string[] = []): ChangeItem {
        return {
            label: key,
            value: collection[key],
            conflict: compare.some(o => o === key)
        };
    }
}
