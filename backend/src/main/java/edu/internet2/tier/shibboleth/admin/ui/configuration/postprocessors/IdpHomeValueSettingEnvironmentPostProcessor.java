package edu.internet2.tier.shibboleth.admin.ui.configuration.postprocessors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

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
 * @author Dmitriy Kopylenko
 */
public class IdpHomeValueSettingEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String IDP_HOME_PROP = "idp.home";

    private static final String METADATA_DIR = "metadata";

    private static final Logger LOGGER = LoggerFactory.getLogger(IdpHomeValueSettingEnvironmentPostProcessor.class);

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        if(environment.getProperty(IDP_HOME_PROP) == null) {
            Map<String, Object> map = new HashMap<>(1);
            try {
                Path tempDir = Files.createTempDirectory(null);
                tempDir.toFile().deleteOnExit();
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
}
