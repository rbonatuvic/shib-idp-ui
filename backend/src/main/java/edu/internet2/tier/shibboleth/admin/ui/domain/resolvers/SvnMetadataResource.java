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

    private String repositoryURL;

    private String workingCopyDirectory;

    private String resourceFile;

    private String username;

    private String password;

    private String proxyHost;

    private String proxyUserName;

    private String proxyPassword;
}
