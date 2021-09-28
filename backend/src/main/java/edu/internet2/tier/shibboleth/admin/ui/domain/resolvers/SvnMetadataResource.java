package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Embeddable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class SvnMetadataResource {

    private String password;

    private String proxyHost;

    private String proxyPassword;

    private String proxyPort;

    private String proxyUserName;

    private String repositoryURL;

    private String resourceFile;

    private String username;

    private String workingCopyDirectory;
}