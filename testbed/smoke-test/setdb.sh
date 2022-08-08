#!/bin/bash

DB=$1

if [[ ! "$DB" =~ ^(postgres|mariadb|mysql|sqlServer)$ ]];
then
    echo "argument mst be one of: postgres mariadb mysql sqlServer"
    exit 0;
fi

if [[ $DB == "postgres" ]];
then
rm -f docker-compose.override.yml
else
rm -f docker-compose.override.yml
ln -s db_configs/$DB.docker-compose.override.yml docker-compose.override.yml
fi

rm -f shibui/application.yml
cat shibui/application.yml.nodb db_configs/$DB.yml >> shibui/application.yml

echo "shibui will now use the $DB container"
