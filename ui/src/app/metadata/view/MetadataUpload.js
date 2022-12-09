import React from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faAsterisk, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';

import Translate from '../../i18n/components/translate';
import { readFileContents } from '../../core/utility/read_file_contents';
import { get_cookie } from '../../core/utility/get_cookie';
import { getMetadataPath } from '../hooks/api';
import { createNotificationAction } from '../../store/notifications/NotificationSlice';
import API_BASE_PATH from '../../App.constant';
import { useDispatch } from 'react-redux';

export function MetadataUpload() {

    const history = useHistory();
    const dispatch = useDispatch();

    const [saving, setSaving] = React.useState(false);

    async function save({serviceProviderName, file, url}) {

        setSaving(true);

        const f = file?.length > 0 ? file[0] : null;

        let body = '';
        let type = '';

        if (f) {
            body = await readFileContents(f);
            type = 'application/xml';
        } else if (url) {
            body = `metadataUrl=${url}`;
            type = 'application/x-www-form-urlencoded';
        }

        const response = await fetch(`/${API_BASE_PATH}${getMetadataPath('source')}?spName=${serviceProviderName}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': type,
                'X-XSRF-TOKEN': get_cookie('XSRF-TOKEN')
            },
            body
        });

        if (response.ok) {
            setSaving(false);
            history.push('/dashboard');
        } else {
            let msg;
            if (f) {
                const message = await response.json();
                msg = `${message.errorCode}: Unable to create file ... ${message.errorMessage}`
            } else {
                msg = await response.text();
            }
            dispatch(createNotificationAction(msg, 'danger', 5000));
            setSaving(false);
        }
    }

    const { register, handleSubmit, watch, formState } = useForm({
        mode: 'onChange',
        reValidateMode: 'onBlur',
        defaultValues: {},
        resolver: undefined,
        context: undefined,
        criteriaMode: "firstError",
        shouldFocusError: true,
        shouldUnregister: false,
    });

    const { errors, isValid } = formState;

    const watchFile = watch('file');
    const watchUrl = watch('url');

    return (
        <div className="row">
            <div className="col col-xl-6 col-lg-9 col-xs-12">
                <form onSubmit={handleSubmit(save)}>
                    <ul className="nav nav-wizard m-3">
                        <li className="nav-item">
                            <h3 className="tag tag-primary">
                                <span className="index">1</span>
                                1. <Translate value="label.name-and-upload-url">Name and Upload Url</Translate>
                            </h3>
                        </li>
                        <li className="nav-item">
                            <Button className="nav-link next btn d-flex justify-content-between align-items-start text-white"
                                disabled={!isValid || saving}
                                aria-label="Save metadata resolver"
                                type="submit">
                                <span className="label">
                                    <Translate value="action.save">
                                    Save
                                    </Translate>
                                </span>
                                <span className="direction d-flex flex-column align-items-center">
                                    <FontAwesomeIcon icon={saving ? faSpinner : faSave} pulse={saving} size="2x" />
                                    <Translate value="action.save">Save</Translate>
                                </span>
                            </Button>
                        </li>
                    </ul>
                    <fieldset className="bg-light border rounded p-4">
                        <div className="form-group mb-3">
                            <label htmlFor="serviceProviderName">
                                <Translate value="label.service-resolver-name-dashboard-display-only">Service Resolver Name (Dashboard Display Only)</Translate>
                                <FontAwesomeIcon icon={faAsterisk} className="text-danger" />
                            </label>
                            <input id="serviceProviderName" type="text" className="form-control"  {...register('serviceProviderName', {
                                required: true
                            })} />
                            {errors?.serviceProviderName?.type === 'required' && <small className="form-text text-danger">
                                <Translate value="message.service-resolver-name-required">
                                    Service Resolver Name is required
                                </Translate>
                            </small>}
                        </div>
                        <div className="form-group mb-3">
                            <Form.Control
                                type="file"
                                id="custom-file"
                                disabled={watchUrl}
                                accept={'.xml'}
                                label={watchFile && watchFile.length > 0 ? 
                                    watchFile[0].name
                                    :
                                    <Translate value="label.service-resolver-file">Select Resolver Metadata File</Translate>
                                }
                                {...register('file')}
                                custom
                            />
                        </div>
                        <div className="text-center">
                            &mdash;
                            <Translate value="label.or">OR</Translate>
                            &mdash;
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="url"><Translate value="label.service-resolver-metadata-url">Service Resolver Metadata URL</Translate></label>
                            <input id="url" disabled={ watchFile && watchFile.length > 0 } type="text" className="form-control"{...register('url')} />
                        </div>
                        <div className="alert alert-danger" role="alert">
                            <span><Translate value="message.file-upload-alert">Note: You can only import a file with a single entityID (EntityDescriptor element) in it. Anything more in that file will result in an error.</Translate></span>
                        </div>
                    </fieldset>
                    <Button className="nav-link next btn d-flex justify-content-between align-items-start sr-only"
                        disabled={!isValid}
                        aria-label="Save metadata resolver"
                        type="submit">
                        <span className="label">
                            <Translate value="action.save">Save</Translate>
                        </span>
                    </Button>
                </form>
            </div>
        </div>

    )
}