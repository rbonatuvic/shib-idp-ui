package edu.internet2.tier.shibboleth.admin.ui.domain.versioning

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import spock.lang.Specification

import java.time.LocalDateTime
import java.time.Month

class VersionJsonSerializationBasicTests extends Specification {

    ObjectMapper mapper

    def setup() {
        mapper = new ObjectMapper()
        mapper.registerModule(new JavaTimeModule())
    }

    def "Verify basic Version JSON serialization"() {
        given:
        def staticDate = LocalDateTime.of(2019, Month.MAY,20,15,0,0)
        def version = new Version('2', 'kramer', staticDate)
        def expectedJson = """
            {
                "id": "2",
                "creator": "kramer",
                "date": "${staticDate.toString()}"                
            }
        """

        when:
        def deSerialized = mapper.readValue(expectedJson, Version)

        then:
        deSerialized == version
    }
}
