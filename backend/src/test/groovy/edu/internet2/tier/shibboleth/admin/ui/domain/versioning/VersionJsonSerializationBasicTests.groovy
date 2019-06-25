package edu.internet2.tier.shibboleth.admin.ui.domain.versioning

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import groovy.json.JsonSlurper
import spock.lang.Specification

import java.time.ZonedDateTime

class VersionJsonSerializationBasicTests extends Specification {

    ObjectMapper mapper

    JsonSlurper jsonSlurper

    def setup() {
        mapper = new ObjectMapper()
        mapper.registerModule(new JavaTimeModule())
        jsonSlurper = new JsonSlurper()
    }

    def "Verify basic Version JSON serialization"() {
        given:
        def staticDate = ZonedDateTime.parse("2019-05-20T15:00:00.574Z")
        def version = new Version('2', 'kramer', staticDate)
        def expectedJson = """
            {
                "id": "2",
                "creator": "kramer",
                "date": "2019-05-20T15:00:00.574Z"                
            }
        """
        def expectedJsonMap = jsonSlurper.parseText(expectedJson)

        when:
        def deSerializedJsonMap = jsonSlurper.parseText(mapper.writeValueAsString(version))

        then:
        deSerializedJsonMap.date == expectedJsonMap.date
    }
}
