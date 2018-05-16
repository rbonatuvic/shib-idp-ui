package edu.internet2.tier.shibboleth.admin.ui.util

import org.apache.commons.lang3.RandomStringUtils

import java.time.LocalDateTime
import java.time.ZoneId

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class RandomGenerator {

    def rand = new Random()

    String randomId() {
        return UUID.randomUUID().toString()
    }

    String randomString() {
        return randomId() //Good enough for now
    }

    String randomString(int min, int max) {
        int length = randomRangeInt(min, max)
        return RandomStringUtils.randomAlphanumeric(length)
    }

    String randomString(int n) {
        return RandomStringUtils.randomAlphanumeric(n)
    }

    int randomRangeInt(int min, int max){
        def val = randomInt(min, max)
        return (val > max) ? max : val
    }

    int randomInt(int min, int max) {
        if (min == max) {
            return min
        } else {
            return min + rand.nextInt(max - min)
        }
    }

    int randomInt() {
        return rand.nextInt()
    }

    Date randomDate() {
        return randomDate(randomBoolean())
    }

    Date randomDateBeforeNow() {
        return randomDate(true)
    }

    //return a date either from before now or after now
    Date randomDate(boolean beforeOrAfter) {
        def now = System.currentTimeMillis()
        def incr = Math.abs(rand.nextLong()) % 10000000 * (beforeOrAfter ? -1 : 1)
        def time = now + incr
        return new Date(time)
    }

    LocalDateTime randomLocalDateTime() {
        def date = randomDate()
        return LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault())
    }

    boolean randomBoolean() {
        return rand.nextBoolean()
    }

    List<String> randomStringList() {
        def stringList = new ArrayList<String>()
        [0..randomInt(1, 10)].each {
            stringList.add(randomString(10))
        }
        return stringList
    }
}
