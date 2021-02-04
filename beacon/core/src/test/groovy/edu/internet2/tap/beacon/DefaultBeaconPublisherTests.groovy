package edu.internet2.tap.beacon

import spock.lang.Specification
import sun.security.x509.OtherName

class DefaultBeaconPublisherTests extends Specification {

    def "DefaultBeaconPublisher invariants are enforced during object creation - null Map is passed"() {
        when:
        new DefaultBeaconPublisher(null)

        then:
        thrown IllegalArgumentException

    }

    def "DefaultBeaconPublisher invariants are enforced during object creation - empty Map is passed"() {
        when:
        new DefaultBeaconPublisher([:])

        then:
        thrown IllegalArgumentException
    }

    def "DefaultBeaconPublisher invariants are enforced during object creation - valid Beacon data Map is passed"() {
        when:
        def expectedJsonPaylaod = """{"msgType":"TIERBEACON", "tbMaintainer":"unittest_maintainer", "msgName":"TIER", "tbProduct":"image", "msgVersion":"1.0", "tbProductVersion":"v1", "tbTIERRelease":"tv1"}"""

        def configuredBeaconData = [LOGHOST   : 'collector.testbed.tier.internet2.edu',
                                    LOGPORT   : '5001',
                                    IMAGE      : 'image',
                                    VERSION    : 'v1',
                                    TIERVERSION: 'tv1',
                                    MAINTAINER : 'unittest_maintainer']
        def p = new DefaultBeaconPublisher(configuredBeaconData)
        println p.jsonPayload

        then:
        noExceptionThrown()
        p.endpointUri == 'http://collector.testbed.tier.internet2.edu:5001'
        p.jsonPayload == expectedJsonPaylaod

    }

}
