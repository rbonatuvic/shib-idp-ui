#!/bin/bash

if [ "$RUN_COMMAND" != "" ] ; 
    then 
        cd shib-idp-ui
        cp .gitignore ./FOO.txt
        exec $RUN_COMMAND;
    else
        tail -f /dev/null         
fi

