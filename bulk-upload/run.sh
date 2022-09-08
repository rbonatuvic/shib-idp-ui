#!/bin/sh

MD=$1
LAST=$(basename "$MD")

if [ -z "$1" ];then
echo "usage: ./run.sh <path to metadata dir> or <path to metadata file or agregate> -e (to enable metadata as it is uploaded)";
exit 1;
fi

if [ -z "${1%%/*}" ];then
  docker run --network=host --mount type=bind,source=$MD,target=/opt/$LAST --mount type=bind,source=$PWD/upload.conf,target=/opt/conf/upload.conf -t unicon/shibui-bulk-upload -m /opt/$LAST $2
else
  docker run --network=host --mount type=bind,source=$PWD/$MD,target=/opt/$LAST --mount type=bind,source=$PWD/upload.conf,target=/opt/conf/upload.conf -t unicon/shibui-bulk-upload -m /opt/$LAST $2
fi
