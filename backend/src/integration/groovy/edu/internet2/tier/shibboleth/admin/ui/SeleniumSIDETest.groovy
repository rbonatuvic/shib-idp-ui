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
        'Create Dynamic HTTP Metadata Resolver' | '/dhmr.side' //passing
        'Metadata Source Happy Path Save'       | '/MetadataSourceHappyPathSAVE.side' //passing
//        'Metadata Provider Happy Path Save'     | '/MetadataProviderHappyPathSAVE.side' // failing (decimal point bug)
//        'Create Filter Entity ID'               | '/CreateFilterEntityID.side' // failing (decimal point bug)
//        'Create Filter REGEX'                   | '/CreateFilterREGEX.side' // failing (decimal point bug)
//        'Create Filter Script'                  | '/CreateFilterScript.side' // failing (decimal point bug)
//        'Create Metadata Source From XML'       | '/CreateMetadataSourceFromXML.side' // failing (Failure: Cannot click <input type=file> elements)
        'Create Metadata Source From Copy'      | '/CreateMetadataSourceFromCopy.side' //passing
//        'Delete Entity ID Filter'               | '/DeleteEntityIDFilter.side' // failing (decimal point bug, possibly also incomplete)
//        'Delete REGEX Filter'                   | '/DeleteREGEXFilter_Incomplete.side' // incomplete
        'Create Metadata Source from URL'       | '/CreateMetadataSourceFromURL.side' //passing
//        'Delete Incomplete Source'              | '/DeleteIncompleteSource_Incomplete.side' // incomplete
    }
}
