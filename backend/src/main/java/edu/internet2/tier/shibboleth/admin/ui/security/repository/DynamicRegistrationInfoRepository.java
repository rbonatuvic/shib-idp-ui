package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.DynamicRegistrationInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DynamicRegistrationInfoRepository extends JpaRepository<DynamicRegistrationInfo, String> {
    List<DynamicRegistrationInfo> findAllByIdOfOwner(String idOfOwner);

    DynamicRegistrationInfo findByResourceId(String id);
}