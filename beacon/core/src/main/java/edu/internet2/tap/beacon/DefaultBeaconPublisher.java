package edu.internet2.tap.beacon;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

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

    private final URL endpointUrl;

    private final String jsonPayload;

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
        try {
            this.endpointUrl = new URL(String.format("http://%s:%s", beaconDetails.get(LOG_HOST), beaconDetails.get(LOG_PORT)));
        } catch (MalformedURLException ex) {
            throw new IllegalArgumentException(ex.getMessage());
        }

        Map<String, String> dataToPublish = new HashMap<>();
        dataToPublish.put("msgType", "TIERBEACON");
        dataToPublish.put("msgName", "TIER");
        dataToPublish.put("msgVersion", "1.0");
        dataToPublish.put("tbProduct", beaconDetails.get(IMAGE));
        dataToPublish.put("tbProductVersion", beaconDetails.get(VERSION));
        dataToPublish.put("tbTIERRelease", beaconDetails.get(TIERVERSION));
        dataToPublish.put("tbMaintainer", beaconDetails.get(MAINTAINER));

        //Create JSON payload without any 3-rd party library
        this.jsonPayload = "{" + dataToPublish.entrySet().stream()
                .map(e -> "\"" + e.getKey() + "\"" + ":\"" + e.getValue() + "\"")
                .collect(Collectors.joining(", ")) + "}";
    }

    @Override
    public void run() {
        try {
            HttpURLConnection con = (HttpURLConnection) this.endpointUrl.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json; utf-8");
            con.setRequestProperty("Accept", "application/json");
            con.setDoOutput(true);
            try(OutputStream os = con.getOutputStream()){
                byte[] input = jsonPayload.getBytes("utf-8");
                os.write(input, 0, input.length);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //getters used in unit tests and calling components for debugging purposes
    public String getEndpointUri() {
        return endpointUrl.toString();
    }

    public String getJsonPayload() {
        return jsonPayload;
    }
}
