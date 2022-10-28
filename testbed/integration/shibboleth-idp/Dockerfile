FROM i2incommon/shib-idp:4.2.1_20220624

# The build args below can be used at build-time to tell the build process where to find your config files.  This is for a completely burned-in config.
ARG TOMCFG=config/tomcat
ARG TOMCERT=credentials/tomcat
ARG TOMWWWROOT=wwwroot
ARG SHBCFG=config/shib-idp/conf
ARG SHBCREDS=credentials/shib-idp
ARG SHBVIEWS=config/shib-idp/views
ARG SHBEDWAPP=config/shib-idp/edit-webapp
ARG SHBMSGS=config/shib-idp/messages
ARG SHBMD=config/shib-idp/metadata
ARG OIDCREG=config/shib-idp/static
ARG TOMREWRITE=config/tomcat/rewrite.config

#enable OIDC plugins and generate needed keys
ADD ${SHBCREDS} /opt/shibboleth-idp/credentials
RUN /opt/shibboleth-idp/bin/plugin.sh -i https://shibboleth.net/downloads/identity-provider/plugins/oidc-common/2.1.0/oidc-common-dist-2.1.0.tar.gz --noPrompt
RUN /opt/shibboleth-idp/bin/plugin.sh -i https://shibboleth.net/downloads/identity-provider/plugins/oidc-op/3.2.1/idp-plugin-oidc-op-distribution-3.2.1.tar.gz --noPrompt
RUN /opt/shibboleth-idp/bin/jwtgen.sh -t RSA -s 2048 -u sig -i defaultRSASign | tail -n +2 > /opt/shibboleth-idp/credentials/idp-signing-rs.jwk
RUN /opt/shibboleth-idp/bin/jwtgen.sh	-t EC -c P-256 -u sig -i defaultECSign | tail -n +2 > /opt/shibboleth-idp/credentials/idp-signing-es.jwk
RUN /opt/shibboleth-idp/bin/jwtgen.sh	-t RSA -s 2048 -u enc -i defaultRSAEnc | tail -n +2 > /opt/shibboleth-idp/credentials/idp-encryption-rsa.jwk

# copy in the needed config files
ADD ${TOMCFG} /usr/local/tomcat/conf
ADD ${TOMCERT} /opt/certs
ADD ${TOMWWWROOT} /usr/local/tomcat/webapps/ROOT
ADD ${SHBCFG} /opt/shibboleth-idp/conf
#ADD ${SHBVIEWS} /opt/shibboleth-idp/views
#ADD ${SHBEDWAPP} /opt/shibboleth-idp/edit-webapp
#ADD ${SHBMSGS} /opt/shibboleth-idp/messages
ADD ${SHBMD} /opt/shibboleth-idp/metadata
ADD ${OIDCREG} /opt/shibboleth-idp/static
ADD ${TOMREWRITE} /opt/shibboleth-idp/edit-webapp/WEB-INF/rewrite.config

EXPOSE 8080
