#!/bin/bash

if [ "$RUN_COMMAND" != "" ] ; 
    then 
        cd shib-idp-ui
        exec $RUN_COMMAND;
    else
        tail -f /dev/null         
fi

