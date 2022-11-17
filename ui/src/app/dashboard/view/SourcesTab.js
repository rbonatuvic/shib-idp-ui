import React from 'react';
import { MetadataActions } from '../../admin/container/MetadataActions';
import Translate from '../../i18n/components/translate';

import SourceList from '../../metadata/domain/source/component/SourceList';
import { Search } from '../component/Search';
import { Spinner } from '../../core/components/Spinner';

import { useChangeSourceGroupMutation, useGetSourcesQuery } from '../../store/metadata/SourceSlice';

const searchProps = ['serviceProviderName', 'entityId', 'createdBy', 'protocol'];

export function SourcesTab () {

    const [changeSourceGroup] = useChangeSourceGroupMutation();

    const { data: sources = [], isLoading: loading } = useGetSourcesQuery();

    return (
        <section className="section">
            <div className="section-body border border-top-0 border-primary">
                <div className="section-header bg-primary p-2 text-light">
                    <span className="lead">
                        <Translate value="label.current-metadata-sources">Current Metadata Sources</Translate>
                    </span>
                </div>
                <div className="p-3">
                    <Search entities={sources} searchable={searchProps}>
                        {(searched) =>
                            <MetadataActions type="source">
                                {({enable, remove}) =>
                                    <SourceList
                                        entities={searched}
                                        onDelete={(id) => remove(id)}
                                        onEnable={(s, e) => enable(s, e) }
                                        onChangeGroup={changeSourceGroup}>
                                            {loading && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }
                                    </SourceList>
                                }
                            </MetadataActions>
                        }
                    </Search>
                </div>
            </div>
        </section>
    );
}
