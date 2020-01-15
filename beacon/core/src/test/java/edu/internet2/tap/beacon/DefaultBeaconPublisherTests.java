package edu.internet2.tap.beacon;

import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class DefaultBeaconPublisherTests {

    @Test
    public void checkCorrectInvariantsWithBeaconDataNull() {
        assertThrows(IllegalArgumentException.class, () -> new DefaultBeaconPublisher(null));
    }

    @Test
    public void checkCorrectInvariantsWithBeaconDataEmpty() {
        assertThrows(IllegalArgumentException.class, () -> new DefaultBeaconPublisher(new HashMap<>()));
    }

    @Test
    public void checkCorrectInvariantsWithValidBeaconData() {
        String expectedJsonPayload = "{\"msgType\":\"TIERBEACON\", \"tbMaintainer\":\"unittest_maintainer\", \"msgName\":\"TIER\", \"tbProduct\":\"image\", \"msgVersion\":\"1.0\", \"tbProductVersion\":\"v1\", \"tbTIERRelease\":\"tv1\"}";

        Map<String, String> beaconData = new HashMap<>();
        beaconData.put("LOGHOST", "collector.testbed.tier.internet2.edu");
        beaconData.put("LOGPORT", "5001");
        beaconData.put("IMAGE", "image");
        beaconData.put("VERSION", "v1");
        beaconData.put("TIERVERSION", "tv1");
        beaconData.put("MAINTAINER", "unittest_maintainer");
        DefaultBeaconPublisher p = new DefaultBeaconPublisher(beaconData);

        assertEquals("http://collector.testbed.tier.internet2.edu:5001", p.getEndpointUri());
        assertEquals(expectedJsonPayload, p.getJsonPayload());
    }
}
