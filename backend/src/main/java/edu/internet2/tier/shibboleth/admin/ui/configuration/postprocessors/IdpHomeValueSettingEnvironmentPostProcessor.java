package edu.internet2.tier.shibboleth.admin.ui.configuration.postprocessors;

import lombok.extern.log4j.Log4j2;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * Spring Boot Environment Post Processor setting the value for idp.home property to a temp directory
 * if no IDP_HOME environment variable has been set already.
 *
 * Also creates IDP_HOME/metadata directory if no such directory already exists.
 *
 * @author Dmitriy Kopylenko
 */
public class IdpHomeValueSettingEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String IDP_HOME_PROP = "idp.home";

    private static final String METADATA_DIR = "metadata";

    private static final Logger LOGGER = LoggerFactory.getLogger(IdpHomeValueSettingEnvironmentPostProcessor.class);

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String existingIdpHome = environment.getProperty(IDP_HOME_PROP);
        Path metadataSubDir = Paths.get(existingIdpHome, METADATA_DIR);
        if (existingIdpHome != null) {
            if (!Files.exists(metadataSubDir)) {
                try {
                    Files.createDirectories(metadataSubDir);
                } catch (IOException e) {
                    LOGGER.error(e.getMessage());
                    throw new RuntimeException(e);
                }
            }
            return;
        }

        Map<String, Object> map = new HashMap<>(1);
        try {
            Path tempDir = Files.createTempDirectory(String.format("%s.%s.", "shibui", IDP_HOME_PROP));
            String tempDirName = tempDir.toAbsolutePath().toString();
            Path tempMetadataSubDir = Paths.get(tempDirName, METADATA_DIR);
            Files.createDirectories(tempMetadataSubDir);
            map.put(IDP_HOME_PROP, tempDirName);
        } catch (IOException e) {
            LOGGER.error(e.getMessage());
            throw new RuntimeException(e);
        }
        environment.getPropertySources().addLast(new MapPropertySource("idp.home.propertysource", map));
    }
}
