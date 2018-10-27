# Metadata providers

The application can generate a `metadata-providers.xml` configuration appropriate for use in the Shibboleth IdP.
There are 2 ways to access this configuration: through a web endpoint or a file.

1. Web endpoint

    A request can be made to the `${ui.baseUrl}/api/MetadataResolvers` to get the
    current configuration
    
2. File export

    A file can be periodically written to disk. Set the application property `shibui.metadataProviders.target`,
    pointing to a spring file resource. Note that there is no value set by default, and nothing will be written
    out by default. A file, once defined, will be written every 30 seconds by default. To change the rate, set the
    `shibui.metadataProviders.taskRunRate` application property, in milliseconds.