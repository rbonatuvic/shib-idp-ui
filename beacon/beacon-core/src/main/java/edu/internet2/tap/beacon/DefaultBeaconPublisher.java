package edu.internet2.tap.beacon;

import java.util.HashMap;
import java.util.Map;

import static edu.internet2.tap.beacon.Beacon.IMAGE;
import static edu.internet2.tap.beacon.Beacon.LOG_HOST;
import static edu.internet2.tap.beacon.Beacon.LOG_PORT;
import static edu.internet2.tap.beacon.Beacon.MAINTAINER;
import static edu.internet2.tap.beacon.Beacon.TIERVERSION;
import static edu.internet2.tap.beacon.Beacon.VERSION;

/**
 * Default implementation that knows the details about payload structure with its data and beacon endpoint details
 * gathered by upstream components and passed to this implementation at object construction site.
 *
 * @author Dmitriy Kopylenko
 */
public class DefaultBeaconPublisher implements BeaconPublisher {

    private String endpointUri;

    private Map<String, String> dataToPublish;

    public DefaultBeaconPublisher(Map<String, String> beaconDetails) {


        //Do data validation checks here. If any of the necessary beacon data not available here, throw a Runtime exception
        if (beaconDetails == null) {
            throw new IllegalArgumentException("beaconDetails Map must not be null");
        }
        if (beaconDetails.get(LOG_HOST) == null
                || beaconDetails.get(LOG_PORT) == null
                || beaconDetails.get(IMAGE) == null
                || beaconDetails.get(VERSION) == null
                || beaconDetails.get(TIERVERSION) == null
                || beaconDetails.get(MAINTAINER) == null) {
            throw new IllegalArgumentException("Not all the necessary beacon data is available to be able to publish to beacon");
        }
        this.endpointUri = String.format("http://%s:%s", beaconDetails.get(LOG_HOST), beaconDetails.get(LOG_PORT));

        this.dataToPublish = new HashMap<>();
        this.dataToPublish.put("msgType", "TIERBEACON");
        this.dataToPublish.put("msgName", "TIER");
        this.dataToPublish.put("msgVersion", "1.0");
        this.dataToPublish.put("tbProduct", beaconDetails.get(IMAGE));
        this.dataToPublish.put("tbProductVersion", beaconDetails.get(VERSION));
        this.dataToPublish.put("tbTIERRelease", beaconDetails.get(TIERVERSION));
        this.dataToPublish.put("tbMaintainer", beaconDetails.get(MAINTAINER));
    }

    @Override
    public void run() {
        //log.debug("Posting data {} to beacon endpoint {}", dataToPublish, endpointUri);
    }

    //Below are package-private getters used in unit tests
    String getEndpointUri() {
        return this.endpointUri;
    }

    Map<String, String> getDataToPublish() {
        return this.dataToPublish;
    }
}
