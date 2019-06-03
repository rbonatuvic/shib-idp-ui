package edu.internet2.tier.shibboleth.admin.ui.service

import org.springframework.core.io.PathResource
import org.springframework.core.io.WritableResource
import spock.lang.Specification

import java.nio.file.Files
import java.nio.file.Path
import java.security.NoSuchAlgorithmException

class FileCheckingFileWritingServiceTests extends Specification {
    def writer = Spy(FileCheckingFileWritingService)

    Path file

    WritableResource resource

    def setup() {
        file = Files.createTempFile('test1', '.txt')
        resource = new PathResource(file)
    }

    def 'test bad algorithm'() {
        setup:
        def badWriter = new FileCheckingFileWritingService('badAlGoreRhythm')

        when:
        badWriter.write(Files.createTempFile('testbadalgorithm', '.txt'), 'bad')

        then:
        RuntimeException ex = thrown()
        assert ex.cause instanceof NoSuchAlgorithmException
    }

    def 'test a single write to a Path'() {
        when:
        writer.write(file, 'testme')

        then:
        1 * writer.writeContent(file, 'testme')
        assert file.text == 'testme'
    }

    def 'test writes with changed content to a Path'() {
        when:
        writer.write(file, 'testme')
        writer.write(file, 'anothertest')

        then:
        1 * writer.writeContent(file, 'testme')
        1 * writer.writeContent(file, 'anothertest')
        assert file.text == 'anothertest'
    }

    def 'test writes with unchanged content, should only write once to a Path'() {
        when:
        (1..5).each {
            writer.write(file, 'testme2')
        }

        then:
        1 * writer.writeContent(file, 'testme2')
        assert file.text == 'testme2'
    }

    def 'test a single write to a WriteableResource'() {
        when:
        writer.write(resource, 'testme')

        then:
        1 * writer.writeContent(resource, 'testme')
        assert resource.getFile().text == 'testme'
    }

    def 'test write with changed content to a WritableResource'() {
        when:
        writer.write(resource, 'testme')
        writer.write(resource, 'anothertest')

        then:
        1 * writer.writeContent(resource, 'testme')
        1 * writer.writeContent(resource, 'anothertest')
        assert resource.getFile().text == 'anothertest'
    }

    def 'test writes with unchanged content, should only write once to a WriteableResource'() {
        when:
        (1..5).each {
            writer.write(resource, 'testme2')
        }

        then:
        1 * writer.writeContent(resource, 'testme2')
        assert resource.getFile().text == 'testme2'
    }
}
