package edu.internet2.tier.shibboleth.admin.ui

import jp.vmi.selenium.selenese.Main
import jp.vmi.selenium.selenese.Runner
import jp.vmi.selenium.selenese.config.DefaultConfig
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ActiveProfiles
import spock.lang.Ignore
import spock.lang.Specification
import spock.lang.Unroll

import java.nio.file.Paths

//TODO: make config configurable
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = [ShibbolethUiApplication])
@ActiveProfiles(['dev'])
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD, methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
class SeleniumSIDETest extends Specification {
    @Value('${local.server.port}')
    int randomPort

    @Ignore
    def "Selenium: just run one"() {
        setup:
        def file = "/SHIBUI-1058_DelegatedAdmin_SubmitSource.side"
        def main = new Main()
        def config = new DefaultConfig([] as String[]).with {
            if (System.properties.getProperty('webdriver.driver')) {
                it.driver = System.properties.getProperty('webdriver.driver')
            } else {
                it.driver = 'remote'
                it.remoteUrl = 'http://selenium-hub:4444/wd/hub'
                it.remoteBrowser = 'firefox'
            }
            if (System.properties.getProperty('selenium.host')) {
                it.baseurl = "http://${System.properties.getProperty('selenium.host')}:${this.randomPort}"
            } else {
                it.baseurl = "http://localhost:${this.randomPort}"
            }
            it
        }
        def runner = new Runner()
        runner.varsMap.put('xmlUpload', Paths.get(this.class.getResource('/TestUpload.xml').toURI()).toString())
        main.setupRunner(runner, config, [] as String[])

        expect:
        def result = runner.run(file, this.class.getResourceAsStream(file))
        runner.finish()

        assert result.level.exitCode == 0
    }

    @Unroll
    def "#name"() {
        setup:
        def main = new Main()
        def config = new DefaultConfig([] as String[]).with {
            if (System.properties.getProperty('webdriver.driver')) {
                it.driver = System.properties.getProperty('webdriver.driver')
            } else {
                it.driver = 'remote'
                it.remoteUrl = 'http://selenium-hub:4444/wd/hub'
                it.remoteBrowser = 'firefox'
            }
            if (System.properties.getProperty('selenium.host')) {
                it.baseurl = "http://${System.properties.getProperty('selenium.host')}:${this.randomPort}"
            } else {
                it.baseurl = "http://localhost:${this.randomPort}"
            }
            if (System.properties.getProperty('webdriver.headless')) {
                it.addCliArgs('--headless')
            }
            it
        }
        def runner = new Runner()
        runner.varsMap.put('xmlUpload', Paths.get(this.class.getResource('/TestUpload.xml').toURI()).toString())
        runner.varsMap.put('SHIBUI950', Paths.get(this.class.getResource('/SHIBUI-950.xml').toURI()).toString())
        main.setupRunner(runner, config, [] as String[])

        expect:
        def result = runner.run(file, this.class.getResourceAsStream(file))
        runner.finish()

        assert result.level.exitCode == 0

        where:
        name                                                                | file
        'SHIBUI-1281: Metadata Source Dashboard'                            | '/SHIBUI-1281.side'
        'SHIBUI-1311: Metadata Provider Dashboard'                          | '/SHIBUI-1311.side'
        'SHIBUI-950: Metadata Source from XML w/ digest'                    | '/SHIBUI-950.side'
        'SHIBUI-1352: Create LocalDynamic provider'                         | '/SHIBUI-1352-1.side'
        'SHIBUI-1352: Create FileSystem provider'                           | '/SHIBUI-1352-2.side'
        'SHIBUI-1333: Verify metadata source configuration'                 | '/SHIBUI-1333.side'
        'SHIBUI-1334: Verify metadata source versioning'                    | '/SHIBUI-1334-1.side'
        'SHIBUI-1334: Verify metadata provider versioning'                  | '/SHIBUI-1334-2.side'
        'SHIBUI-1335: Verify File Backed HTTP Metadata Provider Filters'    | '/SHIBUI-1335-1.side'
        'SHIBUI-1335: Verify Filesystem Metadata Provider Filters'          | '/SHIBUI-1335-2.side'
        'SHIBUI-1335: Verify Local Dynamic Metadata Provider Filters'       | '/SHIBUI-1335-3.side'
        'SHIBUI-1335: Verify Dynamic HTTP Metadata Provider Filters'        | '/SHIBUI-1335-4.side'
        'SHIBUI-1392: Verify provider with script filter is persistable'    | '/SHIBUI-1392.side'
        'SHIBUI-1361: Verify dates display in proper format'                | '/SHIBUI-1361.side'
        'SHIBUI-1385: Restore a metadata source version'                    | '/SHIBUI-1385-1.side'
        'SHIBUI-1385: Restore a metadata provider version'                  | '/SHIBUI-1385-2.side'
        'SHIBUI-1391: Regex Validation'                                     | '/SHIBUI-1391.side'
    }
}

