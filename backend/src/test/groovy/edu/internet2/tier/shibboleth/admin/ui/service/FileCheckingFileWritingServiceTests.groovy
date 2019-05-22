package edu.internet2.tier.shibboleth.admin.ui.service

import spock.lang.Specification

import java.nio.file.Files
import java.security.NoSuchAlgorithmException

class FileCheckingFileWritingServiceTests extends Specification {
    def writer = Spy(FileCheckingFileWritingService)

    def file1 = Files.createTempFile('test1', '.txt')
    def file2 = Files.createTempFile('test2', '.txt')

    def "test bad algorithm"() {
        setup:
        def badWriter = new FileCheckingFileWritingService('badAlGoreRhythm')

        when:
        badWriter.write(Files.createTempFile('testbadalgorithm', '.txt'), 'bad')

        then:
        RuntimeException ex = thrown()
        assert ex.cause instanceof NoSuchAlgorithmException
    }

    def "test a single write"() {
        when:
        writer.write(file1, 'testme')

        then:
        1 * writer.writeContent(file1, 'testme'.bytes)
    }

    def "test writes with changed content"() {
        when:
        writer.write(file2, 'testme')
        writer.write(file2, 'anothertest')

        then:
        1 * writer.writeContent(file2, 'testme'.bytes)
        1 * writer.writeContent(file2, 'anothertest'.bytes)
    }

    def "test writes with unchanged content, should only write once"() {
        when:
        (1..5).each {
            writer.write(file1, 'testme')
        }

        then:
        1 * writer.writeContent(file1, 'testme'.bytes)
    }
}
