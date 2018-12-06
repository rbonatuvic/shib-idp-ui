package edu.internet2.tier.shibboleth.admin.ui

import jp.vmi.selenium.selenese.Main
import jp.vmi.selenium.selenese.Runner
import jp.vmi.selenium.selenese.config.DefaultConfig
import spock.lang.Specification
import spock.lang.Unroll

class SeleniumSIDETest extends Specification {
    @Unroll
    def "#name"() {
        setup:
        def main = new Main()
        def config = new DefaultConfig([] as String[]).with {
            System.properties.contains('')
            if (System.properties.getProperty('webdriver.driver')) {
                it.driver = System.properties.getProperty('webdriver.driver')
            }
            it.baseurl = 'http://localhost:10101'
            it
        }
        def runner = new Runner()
        main.setupRunner(runner, config, [] as String[])

        expect:
        def result = runner.run(file, this.class.getResourceAsStream(file))
        runner.finish()

        assert result.level.exitCode == 0

        where:
        name | file
        'Create Dynamic HTTP Metadata Resolver' | '/dhmr.side'
        'Metadata Source Happy Path Save'       | '/MetadataSourceHappyPathSAVE.side'
        'Metadata Provider Happy Path Save'     | '/MetadataProviderHappyPathSAVE.side'
        'Create Filter Entity ID'               | '/CreateFilterEntityID.side'
        'Create Filter REGEX'                   | '/CreateFilterREGEX.side'
        'Create Filter Script'                  | '/CreateFilterScript.side'
        'Create Metadata Source From XML'       | '/CreateMetadataSourceFromXML.side'
        'Create Metadata Source From Copy'      | '/CreatemetaSourceFromCopy.side'
        'Delete Entity ID Filter'               | '/DeleteEntityIDFilter.side'
        'Delete REGEX Filter'                   | '/DeleteREGEXFilter_Incomplete.side' // incomplete
        'Create Metadata Source from URL'       | '/CreateMetadataSourceFromURL.side'
        'Delete Incomplete Source'              | '/DeleteIncompleteSource_Incomplete.side' // incomplete
    }
}
