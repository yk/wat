$SHELL $WAT_RUN_CMD ; echo $? > exit_status ; echo done > status ; date > endtime ; if [ -e wat_run_next_cmd.sh ] ; then $SHELL wat_run_next_cmd.sh ; fi
