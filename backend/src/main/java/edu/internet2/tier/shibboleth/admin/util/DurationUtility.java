package edu.internet2.tier.shibboleth.admin.util;

import org.apache.commons.lang3.StringUtils;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.Duration;
import java.util.Date;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class DurationUtility {
    private static final DatatypeFactory datatypeFactory;

    static {
        DatatypeFactory factory;
        try {
            factory = DatatypeFactory.newInstance();
        } catch (DatatypeConfigurationException e) {
            factory = null;
        }
        datatypeFactory = factory;
    }

    public static Long toMillis(String xmlDuration) {
        if (datatypeFactory == null) {
            throw new RuntimeException("DatatypeFactory was never initialized!");
        }
        if (StringUtils.isBlank(xmlDuration)) {
            return 0L;
        }
        Duration duration = datatypeFactory.newDuration(xmlDuration);

        Date zero = new Date(0);
        duration.addTo(zero); // potentially can return undesired results for large xmlDurations
        return zero.getTime();
    }

    public static java.time.Duration toTimeDuration(String xmlDuration) {
        long value = toMillis(xmlDuration);
        return java.time.Duration.ofMillis(value);
    }

    public static java.time.Duration toPositiveNonZeroDuration (String xmlDuration, java.time.Duration defaultDuration) {
        long value = toMillis(xmlDuration);
        return value > 0 ? java.time.Duration.ofMillis(value) : defaultDuration;
    }
}