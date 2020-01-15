package edu.internet2.tap.beacon;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

public class DefaultBeaconPublisherTests {

    @Test
    public void checkCorrectInvariantsWithBeaconDataNull() {
        assertThrows(IllegalArgumentException.class, () -> {
            new DefaultBeaconPublisher(null);
        });
    }
}
