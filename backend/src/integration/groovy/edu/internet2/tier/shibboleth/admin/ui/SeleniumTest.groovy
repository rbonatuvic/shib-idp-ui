package edu.internet2.tier.shibboleth.admin.ui

import com.sebuilder.interpreter.Script
import com.sebuilder.interpreter.factory.ScriptFactory
import com.sebuilder.interpreter.factory.StepTypeFactory
import com.sebuilder.interpreter.factory.TestRunFactory
import spock.lang.Specification
import spock.lang.Unroll

class SeleniumTest extends Specification {
    @Unroll
    def "#name"() {
        expect:
        ScriptFactory scriptFactory = new ScriptFactory().with {
            it.stepTypeFactory = new StepTypeFactory()
            it.testRunFactory = new TestRunFactory()
            it
        }
        def x = this.class.getResource(file)
        def scripts = scriptFactory.parse(new File(this.class.getResource(file).toURI()))
        for (Script script : scripts) {
            def lastRun = scriptFactory.testRunFactory.createTestRun(script)
            assert lastRun.finish()
        }

        where:
        name | file
        'Create metadata source from url' | '/CreateMetaDataSourceFromURL.json'
    }
}
