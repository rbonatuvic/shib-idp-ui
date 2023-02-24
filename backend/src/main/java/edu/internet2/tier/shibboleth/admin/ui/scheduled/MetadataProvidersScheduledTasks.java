package edu.internet2.tier.shibboleth.admin.ui.scheduled;

import edu.internet2.tier.shibboleth.admin.ui.service.FileWritingService;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService;
import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
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
import java.io.StringWriter;

@Configuration
@ConditionalOnProperty("shibui.metadataProviders.target")
@EnableSchedulerLock(defaultLockAtMostFor = "30m")
public class MetadataProvidersScheduledTasks {
    private static final Logger logger = LoggerFactory.getLogger(MetadataProvidersScheduledTasks.class);

    private final Resource target;
    private final MetadataResolverService metadataResolverService;
    private final FileWritingService fileWritingService;

    public MetadataProvidersScheduledTasks(Resource target, MetadataResolverService metadataResolverService, FileWritingService fileWritingService) {
        this.target = target;
        this.metadataResolverService = metadataResolverService;
        this.fileWritingService = fileWritingService;
    }

    @Scheduled(fixedRateString = "${shibui.metadataProviders.taskRunRate:30000}")
    @SchedulerLock(name = "generateMetadataProvidersFile")
    @Transactional(readOnly = true)
    public void generateMetadataProvidersFile() {
        try (StringWriter os = new StringWriter()) {
            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");


            transformer.transform(new DOMSource(metadataResolverService.generateConfiguration()), new StreamResult(os));
            this.fileWritingService.write((WritableResource)this.target, os.toString());
        } catch (IOException | TransformerException e) {
            logger.error(e.getLocalizedMessage(), e);
        }
    }
}