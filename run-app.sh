#!/usr/bin/env bash

./gradlew -Dshibui.logout-url=/dashboard "$@" clean bootRun npm_run_start --parallel
