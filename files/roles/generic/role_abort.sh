if [ -e wat_run_next_cmd.sh ] ; then rm wat_run_next_cmd.sh ; fi
if [ -e pid ] ; then to_kill_pid=`cat pid`; kill -TERM -`cat /proc/$to_kill_pid/stat | cut -d' ' -f5` ; fi
