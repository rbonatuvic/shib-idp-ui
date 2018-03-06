#!/usr/bin/env bash

./gradlew -Dshibui.logout-url=/dashboard clean bootRun npm_run_start --parallel -Pnpm-args="-- --i18nFile=./src/locale/es.xlf --i18nFormat=xlf --locale=es --aot"