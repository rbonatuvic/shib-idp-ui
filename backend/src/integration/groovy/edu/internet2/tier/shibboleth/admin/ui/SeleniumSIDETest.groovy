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
            it
        }
        def runner = new Runner()
        runner.varsMap.put('xmlUpload', Paths.get(this.class.getResource('/TestUpload.xml').toURI()).toString())
        main.setupRunner(runner, config, [] as String[])

        expect:
        def result = runner.run(file, this.class.getResourceAsStream(file))
        runner.finish()

        assert result.level.exitCode == 0

        where:
        //TODO: Update or delete where necessary
        name                                                | file
//        'Create Dynamic HTTP Metadata Resolver'             | '/dhmr.side'
//        'Metadata Source Happy Path Save'                   | '/MetadataSourceHappyPathSAVE.side'
//        'Metadata Provider Happy Path Save'                 | '/MetadataProviderHappyPathSAVE.side'
//        'Create Filter Entity ID'                           | '/CreateFilterEntityID.side'
//        'Create Filter REGEX'                               | '/CreateFilterREGEX.side'
//        'Create Filter Script'                              | '/CreateFilterScript.side'
//        'Create Metadata Source From XML'                   | '/CreateMetadataSourceFromXML.side'
//        'Create Metadata Source From Copy'                  | '/CreateMetadataSourceFromCopy.side' // currently does not populate MDUI before copy (causes 400)
//        'Create Metadata Source from URL'                   | '/CreateMetadataSourceFromURL.side'
//        'Delete Entity ID Filter'                           | '/DeleteEntityIDFilter.side'
//        'Delete REGEX Filter'                               | '/DeleteREGEXFilter.side'
//        'Delete Incomplete Source'                          | '/DeleteIncompleteSource.side'
//        'Admin Login'                                       | '/SHIBUI-1031_AdminLogin.side'
//        'Delegated Admin: SubmitSource'                     | '/SHIBUI-1058_DelegatedAdmin_SubmitSource.side'
//        'Create Filesystem Metadata Resolver'               | '/CreateFilesystemMetadataResolver.side'
//        'Create Local Dynamic Metadata Resolver'            | '/CreateLocalDynamicMetadataResolver.side'
//        'Delete Entity Attributes Script Filter'            | '/DeleteScriptFilter.side'
//        'Create and Delete Name ID Format Entity ID Filter' | '/CreateAndDeleteNameIDFormatEntityIDFilter.side'
//        'Create and Delete Name ID Format Regex Filter'     | '/CreateAndDeleteNameIDFormatRegexFilter.side'
//        'Create and Delete Name ID Format Script Filter'    | '/CreateAndDeleteNameIDFormatScriptFilter.side'
//        'Create and Modify Filter Order'                    | '/ModifyFilterOrder.side'
        'SHIBUI-1281: Metadata Source Dashboard'            | '/SHIBUI-1281.side'
    }
}

