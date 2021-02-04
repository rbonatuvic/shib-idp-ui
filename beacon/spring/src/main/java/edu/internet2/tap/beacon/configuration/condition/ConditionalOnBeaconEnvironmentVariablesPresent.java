package edu.internet2.tap.beacon.configuration.condition;

import org.springframework.context.annotation.Conditional;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * {@link Conditional} that matches specific beacon environment variables are all present.
 *
 * @author Dmitriy Kopylenko
 */
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Conditional(BeaconEnvironmentVariablesCondition.class)
public @interface ConditionalOnBeaconEnvironmentVariablesPresent {
}
