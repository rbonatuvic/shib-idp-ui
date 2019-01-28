import * as ZSchema from 'z-schema';
import { ZSchemaValidatorFactory } from 'ngx-schema-form';

export class CustomSchemaValidatorFactory extends ZSchemaValidatorFactory {

    protected zschema;

    constructor() {
        super();
        this.createSchemaValidator();
    }

    private createSchemaValidator() {
        this.zschema = new ZSchema({
            breakOnFirstError: false
        });
    }
}

