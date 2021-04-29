import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { MetadataOptions } from './view/MetadataOptions';
import { MetadataDetail } from './component/MetadataDetail';
import { MetadataHistory } from './view/MetadataHistory';
import { MetadataEditor } from './editor/MetadataEditor';
import { MetadataSelector } from './hoc/MetadataSelector';
import { MetadataSchema } from './hoc/MetadataSchema';
import { MetadataXmlLoader } from './hoc/MetadataXmlLoader';
import { MetadataXml } from './view/MetadataXml';
import { MetadataComparison } from './view/MetadataComparison';
import { MetadataVersion } from './view/MetadataVersion';

export function Metadata () {

    let { path } = useRouteMatch();

    return (
        <MetadataSelector>
            {(entity) =>
            <MetadataXmlLoader>
                <MetadataSchema entity={ entity }>
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
                        <Route path={`${path}/configuration/compare`} render={ () =>
                            <MetadataDetail>
                                <MetadataComparison></MetadataComparison>
                            </MetadataDetail>
                        } />
                        <Route path={`${path}/configuration/version/:versionId/options`} render={ () =>
                            <MetadataDetail>
                                <MetadataVersion></MetadataVersion>
                            </MetadataDetail>
                        } />
                        <Route path={`${path}/edit`} component={ MetadataEditor } />
                    </Switch>
                </MetadataSchema>
            </MetadataXmlLoader>
            }
        </MetadataSelector>
    );
}