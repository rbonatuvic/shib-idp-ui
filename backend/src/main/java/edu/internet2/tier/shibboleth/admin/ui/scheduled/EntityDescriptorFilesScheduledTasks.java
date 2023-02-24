package edu.internet2.tier.shibboleth.admin.ui.scheduled;

import com.google.common.collect.Sets;
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.FileWritingService;
import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.bouncycastle.util.encoders.Hex;
import org.opensaml.core.xml.io.MarshallingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Set;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toSet;

/**
 * This class is wrapped with Spring's scheduling facility to produce background scheduled periodic tasks pertaining to
 * generating, cleaning, etc. of entity descriptor files conforming to Shibboleth's <i>LocalDynamicMetadataProvider</i> naming
 * specification.
 *
 * @since 1.0
 */
@Configuration
@ConditionalOnProperty(name = "shibui.metadata-dir")
@EnableSchedulerLock(defaultLockAtMostFor = "${shibui.maxTask.lockTime:30m}")
public class EntityDescriptorFilesScheduledTasks {
    private static final Logger LOGGER = LoggerFactory.getLogger(EntityDescriptorFilesScheduledTasks.class);
    private static final String SHA1HEX_FILENAME_TEMPLATE = "%s.xml";
    private static final String TARGET_FILE_TEMPLATE = "%s/%s";

    /** cache by entity id and the last time we wrote out (or started the system) */
    private static final HashMap<String, LocalDateTime> LAST_WRITTEN_CACHE = new HashMap();

    private EntityDescriptorRepository entityDescriptorRepository;
    private final FileWritingService fileWritingService;
    private String metadataDirName;
    private OpenSamlObjects openSamlObjects;

    @Value("${shibui.entityDescriptor.writeOnStartup:true}")
    private boolean writeOnStartup;

    public EntityDescriptorFilesScheduledTasks(String metadataDirName,
                                               EntityDescriptorRepository entityDescriptorRepository,
                                               OpenSamlObjects openSamlObjects,
                                               FileWritingService fileWritingService) {
        this.metadataDirName = metadataDirName;
        this.entityDescriptorRepository = entityDescriptorRepository;
        this.openSamlObjects = openSamlObjects;
        this.fileWritingService = fileWritingService;
    }

    @Scheduled(fixedRateString = "${shibui.taskRunRate:30000}")
    @SchedulerLock(name = "generateEntityDescriptorFiles")
    @Transactional(readOnly = true)
    public void generateEntityDescriptorFiles() {
        this.entityDescriptorRepository.findAllStreamByServiceEnabled(true)
                .forEach(ed -> {
                    Path targetFilePath = targetFilePathFor(toSha1HexString(ed.getEntityID()));
                    if (needToWriteUpdate(ed)) {
                        LOGGER.info("Generating/Overwriting entity descriptor file [{}] for entity id [{}]", targetFilePath, ed.getEntityID());
                        writeFile(ed, targetFilePath);
                    }
                });
    }

    /**
     * @return boolean true if any of the conditions for writing a file are true
     * ** The file does not exist
     * OR
     * ** Write on startup (ie if we don't have a record of the file being written (there are a couple of scenarios that fit this)) IF configured to do so
     * OR
     * ** The ed last update/change time is after the last written cache time
     */
    private boolean needToWriteUpdate(EntityDescriptor ed) {
        Path targetFilePath = targetFilePathFor(toSha1HexString(ed.getEntityID()));
        // If the file has never been written, write it out
        if (!Files.exists(targetFilePath)) {
            return true;
        }
        // If we don't have an entry in the cache, add the entry and write it out only if configured to do so on startup
        // Regardless, if we don't have a cached entry, cache one
        if (!LAST_WRITTEN_CACHE.containsKey(ed.getEntityID())) {
            LAST_WRITTEN_CACHE.put(ed.getEntityID(), LocalDateTime.now());
            return writeOnStartup;
        }
        // If the entity is in the cache, write out only if the entity's last modified time is after the last cache time.
        if (LAST_WRITTEN_CACHE.get(ed.getEntityID()).isBefore(ed.getModifiedDate())) {
            LAST_WRITTEN_CACHE.put(ed.getEntityID(), LocalDateTime.now());
            return true;
        }
        return false;
    }

    private void writeFile(EntityDescriptor ed, Path targetFilePath) {
        try {
            String xmlContent = this.openSamlObjects.marshalToXmlString(ed);
            fileWritingService.write(targetFilePath, xmlContent);
        } catch (MarshallingException | IOException e) {
            //TODO: any other better way to handle it?
            LOGGER.error("Error marshalling entity descriptor into a file {} - {}", ed.getEntityID(), e.getMessage());
        }
        LAST_WRITTEN_CACHE.put(ed.getEntityID(), LocalDateTime.now());
    }

    @Scheduled(fixedDelayString = "${shibui.taskDelayRate:30000}")
    @SchedulerLock(name = "removeDanglingEntityDescriptorFiles")
    @Transactional(readOnly = true)
    public void removeDanglingEntityDescriptorFiles() {
        Path targetDirPath = Paths.get(this.metadataDirName);
        try (Stream<Path> directoryStream = Files.list(targetDirPath)) {
            Set<String> allFilesWithoutExt = directoryStream
                    .filter(it -> it.toString().endsWith(".xml"))
                    .map(Path::getFileName)
                    .map(Path::toString)
                    .map(it -> it.substring(0, it.indexOf(".")))
                    .collect(toSet());

            Set<String> enabledEidsSha1Hashes = this.entityDescriptorRepository.findAllStreamByServiceEnabled(true)
                    .map(EntityDescriptor::getEntityID)
                    .map(EntityDescriptorFilesScheduledTasks::toSha1HexString)
                    .collect(toSet());

            Set<String> fileNamesToDelete = Sets.difference(allFilesWithoutExt, enabledEidsSha1Hashes);

            fileNamesToDelete.forEach(fName -> {
                Path targetFilePath = targetFilePathFor(fName);
                try {
                    LOGGER.info("Deleting dangling metadata file [{}]", targetFilePath);
                    Files.delete(targetFilePath);
                } catch (IOException e) {
                    //TODO: any other better way to handle it?
                    LOGGER.error("Unable to delete file [{}} - {}", targetFilePath, e.getMessage());
                }
            });
        } catch (IOException e) {
            //TODO: any other better way to handle it?
            LOGGER.error("Error manipulating files in [{}] - {}", targetDirPath, e.getMessage());
        }
    }

    private static String toSha1HexString(final String sourceString) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            byte[] hash = digest.digest(sourceString.getBytes(StandardCharsets.UTF_8));
            return Hex.toHexString(hash);
        } catch (NoSuchAlgorithmException e) {
            //Should never get here?
            throw new IllegalStateException(e.getMessage());
        }
    }

    private Path targetFilePathFor(String sha1HexBaseFilename) {
        String filename = String.format(SHA1HEX_FILENAME_TEMPLATE, sha1HexBaseFilename);
        String filenamePath = String.format(TARGET_FILE_TEMPLATE, this.metadataDirName, filename);
        return Paths.get(filenamePath);
    }
}