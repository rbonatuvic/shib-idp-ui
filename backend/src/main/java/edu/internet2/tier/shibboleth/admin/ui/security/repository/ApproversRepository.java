package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Approvers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApproversRepository extends JpaRepository<Approvers, String> {
}