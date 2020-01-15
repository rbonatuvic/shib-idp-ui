package edu.internet2.tap.beacon;

/**
 * Simple SPI allowing implementations to publish to beacon service utilizing Runnable API
 * so that publishing code could run in separate threads of execution.
 *
 * @author Dmitriy Kopylenko
 */
public interface BeaconPublisher extends Runnable {
}
