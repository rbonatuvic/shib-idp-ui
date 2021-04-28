import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { MetadataOptions } from './component/MetadataOptions';
import { MetadataDetail } from './component/MetadataDetail';
import { MetadataHistory } from './component/MetadataHistory';
import { MetadataEditor } from './editor/MetadataEditor';
import { MetadataSelector } from './hoc/MetadataSelector';
import { MetadataSchema } from './hoc/MetadataSchema';
import { MetadataXmlLoader } from './hoc/MetadataXmlLoader';
import { MetadataXml } from './component/MetadataXml';

export function Metadata () {

    let { path } = useRouteMatch();

    return (
        <MetadataSelector>
            <MetadataXmlLoader>
                <MetadataSchema>
                    <Switch>
                        <Route path={`${path}/configuration/options`} render={ () =>
                            <MetadataDetail>
                                <MetadataOptions></MetadataOptions>
                            </MetadataDetail>
                        } />
                        <Route path={`${path}/configuration/xml`} render={() =>
                            <MetadataDetail>
                                <MetadataXml></MetadataXml>
                            </MetadataDetail>
                        } />
                        <Route path={`${path}/configuration/history`} render={ () =>
                            <MetadataDetail>
                                <MetadataHistory></MetadataHistory>
                            </MetadataDetail>
                        } />
                        <Route path={`${path}/edit`} component={ MetadataEditor } />
                    </Switch>
                </MetadataSchema>
            </MetadataXmlLoader>
        </MetadataSelector>
    );
}