package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import org.springframework.beans.factory.annotation.Autowired

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class IndexWriterServiceTests extends AbstractBaseDataJpaTest {
    @Autowired
    IndexWriterService service

    def "retrieving index writer for the same resource id multiple times results in the same index writer being returned"() {
        given:
        def resourceId = "12345"

        when:
        def firstIndexWriter = service.getIndexWriter(resourceId) // causes new index writer to be created and added to map
        def secondIndexWriter = service.getIndexWriter(resourceId) // retrieves the same index writer from above

        then:
        firstIndexWriter == secondIndexWriter
    }
}