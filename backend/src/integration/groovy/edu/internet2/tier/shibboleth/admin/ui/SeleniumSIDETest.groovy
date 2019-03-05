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

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = [ShibbolethUiApplication])
@ActiveProfiles(['dev'])
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD, methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
class SeleniumSIDETest extends Specification {
    @Value('${local.server.port}')
    int randomPort

    def "Selenium: just run one"() {
        setup:
        def file = "/SHIBUI-1058_DelegatedAdmin_SubmitSourceWithError.side"
        def main = new Main()
        def config = new DefaultConfig([] as String[]).with {
            System.properties.contains('')
            if (System.properties.getProperty('webdriver.driver')) {
                it.driver = System.properties.getProperty('webdriver.driver')
            }
            it.baseurl = "http://localhost:${this.randomPort}"
            it
        }
        def runner = new Runner()
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
            System.properties.contains('')
            if (System.properties.getProperty('webdriver.driver')) {
                it.driver = System.properties.getProperty('webdriver.driver')
            }
            it.baseurl = "http://localhost:${this.randomPort}"
            it
        }
        def runner = new Runner()
        main.setupRunner(runner, config, [] as String[])

        expect:
        def result = runner.run(file, this.class.getResourceAsStream(file))
        runner.finish()

        assert result.level.exitCode == 0

        where:
        name                                     | file
        'Create Dynamic HTTP Metadata Resolver' | '/dhmr.side'
        'Metadata Source Happy Path Save'       | '/MetadataSourceHappyPathSAVE.side'
        'Metadata Provider Happy Path Save'     | '/MetadataProviderHappyPathSAVE.side'
        'Create Filter Entity ID'               | '/CreateFilterEntityID.side'
        'Create Filter REGEX'                   | '/CreateFilterREGEX.side'
        'Create Filter Script'                  | '/CreateFilterScript.side'
//        'Create Metadata Source From XML'       | '/CreateMetadataSourceFromXML.side' // failing (Failure: Cannot click <input type=file> elements)
        'Create Metadata Source From Copy'      | '/CreateMetadataSourceFromCopy.side' //failing, error reported to JJ/Ryan
        'Create Metadata Source from URL'       | '/CreateMetadataSourceFromURL.side'
        'Delete Entity ID Filter'               | '/DeleteEntityIDFilter.side'
        'Delete REGEX Filter'                   | '/DeleteREGEXFilter.side'
        'Delete Incomplete Source'              | '/DeleteIncompleteSource.side'
        'Admin Login'                           | '/SHIBUI-1031_AdminLogin.side'
//        'Delegated Admin: SubmitSourceWithError' | '/SHIBUI-1058_DelegatedAdmin_SubmitSourceWithError.side' //passing, but with heap problem
    }
}
