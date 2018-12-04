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
    }
}
