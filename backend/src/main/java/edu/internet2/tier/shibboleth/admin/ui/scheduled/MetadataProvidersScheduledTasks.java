package edu.internet2.tier.shibboleth.admin.ui.scheduled;

import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.WritableResource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.IOException;
import java.io.OutputStream;

@Configuration
@ConditionalOnProperty("shibui.metadataProviders.target")
public class MetadataProvidersScheduledTasks {
    private static final Logger logger = LoggerFactory.getLogger(MetadataProvidersScheduledTasks.class);

    private final Resource target;
    private final MetadataResolverService metadataResolverService;

    public MetadataProvidersScheduledTasks(Resource target, MetadataResolverService metadataResolverService) {
        this.target = target;
        this.metadataResolverService = metadataResolverService;
    }

    @Scheduled(fixedRateString = "${shibui.metadataProviders.taskRunRate:30000}")
    @Transactional(readOnly = true)
    public void generateMetadataProvidersFile() {
        try (OutputStream os = ((WritableResource)target).getOutputStream()) {
            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");


            transformer.transform(new DOMSource(metadataResolverService.generateConfiguration()), new StreamResult(os));
        } catch (IOException | TransformerException e) {
            logger.error(e.getLocalizedMessage(), e);
        }
    }
}
