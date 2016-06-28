for i in `echo $WAT_ENV_FILES | tr ' ' '\n'` ; do source $i > /dev/null 2>&1 ; done
echo running > status
date > starttime
$SHELL generic_detach.sh
