package edu.internet2.tier.shibboleth.admin.ui.repository;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomAttribute;

/**
 * Repository to manage {@link CustomAttribute} instances.
 */
public interface CustomAttributeRepository extends JpaRepository<CustomAttribute, String> {
   
    List<CustomAttribute> findAll();
    
    CustomAttribute findByName(String name);
    
    @SuppressWarnings("unchecked")
    CustomAttribute save(CustomAttribute attribute);
}
