package edu.internet2.tap.beacon.configuration;

import edu.internet2.tap.beacon.DefaultBeaconPublisher;
import edu.internet2.tap.beacon.configuration.condition.ConditionalOnBeaconEnvironmentVariablesPresent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.HashMap;
import java.util.Map;

import static edu.internet2.tap.beacon.Beacon.IMAGE;
import static edu.internet2.tap.beacon.Beacon.LOG_HOST;
import static edu.internet2.tap.beacon.Beacon.LOG_PORT;
import static edu.internet2.tap.beacon.Beacon.MAINTAINER;
import static edu.internet2.tap.beacon.Beacon.TIERVERSION;
import static edu.internet2.tap.beacon.Beacon.VERSION;

@Configuration
@ConditionalOnProperty(name = "shibui.beacon-enabled", havingValue = "true")
public class BeaconPublishingConfiguration {

    private static final Logger logger = LoggerFactory.getLogger(BeaconPublishingConfiguration.class);

    @Bean
    @ConditionalOnBeaconEnvironmentVariablesPresent
    public BeaconPublishingTask beaconPublisher(Environment env) {
        logger.debug("Creating BeaconPublishingTask...");
        Map<String, String> beaconData = new HashMap<>();
        beaconData.put(LOG_HOST, env.getProperty(LOG_HOST));
        beaconData.put(LOG_PORT, env.getProperty(LOG_PORT));
        beaconData.put(IMAGE, env.getProperty(IMAGE));
        beaconData.put(VERSION, env.getProperty(VERSION));
        beaconData.put(TIERVERSION, env.getProperty(TIERVERSION));
        beaconData.put(MAINTAINER, env.getProperty(MAINTAINER));
        return new BeaconPublishingTask(new DefaultBeaconPublisher(beaconData));
    }

    public static class BeaconPublishingTask {
        private DefaultBeaconPublisher beaconPublisher;

        public BeaconPublishingTask(DefaultBeaconPublisher beaconPublisher) {
            this.beaconPublisher = beaconPublisher;
        }

        //Cron is based on the spec defined here: https://spaces.at.internet2.edu/display/TWGH/TIER+Instrumentation+-+The+TIER+Beacon
        @Scheduled(cron = "0 ${random.int[0,59]} ${random.int[0,3]} ? * *")
        @Async
        void publish() {
            logger.debug("Publishing payload: {} to beacon endpoint: {}",
                    beaconPublisher.getJsonPayload(),
                    beaconPublisher.getEndpointUri());
            beaconPublisher.run();
        }
    }
}
