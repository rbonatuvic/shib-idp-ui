package edu.internet2.tier.shibboleth.admin.ui

import jp.vmi.selenium.selenese.Main
import jp.vmi.selenium.selenese.Runner
import jp.vmi.selenium.selenese.config.DefaultConfig
import spock.lang.Specification
import spock.lang.Unroll

class SeleniumSIDETest extends Specification {
    @Unroll
    def "#name"() {
        expect:
        def main = new Main()
        def config = new DefaultConfig([] as String[])
        def runner = new Runner()
        main.setupRunner(runner, config, [] as String[])

        def result = runner.run(file, this.class.getResourceAsStream(file))
        runner.finish()
        assert result.level.exitCode == 0

        where:
        name | file
        'Create Dynamic HTTP Metadata Resolver' | '/dhmr.side'
    }
}
