import React from 'react';

import useFetch from 'use-http';

import Translate from '../../i18n/components/translate';

const formatter = v => v && v.build ? `${v.build.version}-${v.git.commit.id}` : '';

const year = new Date().getFullYear();
const params = { year };

export function VersionInfo () {

    const { data = {} } = useFetch('/actuator/info', {}, []);

    const [ versionData, setVersionData ] = React.useState('');
    
    React.useEffect(() => {
        setVersionData(formatter(data));
    }, [data]);

    return (
        <p>
            {versionData}
            &nbsp;|&nbsp;
            <Translate value="brand.footer.copyright" params={params}> Copyright & copy; Internet2</Translate>
        </p>
    );
}

export default VersionInfo;