package edu.internet2.tap.beacon.configuration.condition;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionOutcome;
import org.springframework.boot.autoconfigure.condition.SpringBootCondition;
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.env.Environment;
import org.springframework.core.type.AnnotatedTypeMetadata;

import static edu.internet2.tap.beacon.Beacon.IMAGE;
import static edu.internet2.tap.beacon.Beacon.LOG_HOST;
import static edu.internet2.tap.beacon.Beacon.LOG_PORT;
import static edu.internet2.tap.beacon.Beacon.MAINTAINER;
import static edu.internet2.tap.beacon.Beacon.TIERVERSION;
import static edu.internet2.tap.beacon.Beacon.VERSION;

/**
 * {@link Condition} that checks for required beacon environment variables.
 *
 * @author Dmitriy Kopylenko
 * @see ConditionalOnBeaconEnvironmentVariablesPresent
 */
public class BeaconEnvironmentVariablesCondition extends SpringBootCondition {

    private static final String MATCHED_MSG = "Beacon properties are present. Beacon activation condition is matched.";

    private static final String NOT_MATCHED_MSG = "Beacon properties are not present. Beacon activation condition is not matched.";

    private static final Logger logger = LoggerFactory.getLogger(BeaconEnvironmentVariablesCondition.class);

    @Override
    public ConditionOutcome getMatchOutcome(ConditionContext context, AnnotatedTypeMetadata metadata) {
        Environment env = context.getEnvironment();
        if (env.containsProperty(LOG_HOST)
                && env.containsProperty(LOG_PORT)
                && env.containsProperty(IMAGE)
                && env.containsProperty(VERSION)
                && env.containsProperty(TIERVERSION)
                && env.containsProperty(MAINTAINER)) {
            logger.debug(MATCHED_MSG);
            return ConditionOutcome.match(MATCHED_MSG);
        }
        logger.debug(NOT_MATCHED_MSG);
        return ConditionOutcome.noMatch(NOT_MATCHED_MSG);
    }
}
