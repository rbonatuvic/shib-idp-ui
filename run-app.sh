#!/usr/bin/env bash

./gradlew -Dspring.profiles.active=no-auth -Dshibui.logout-url=/dashboard "$@" clean bootRun npm_run_start --parallel
