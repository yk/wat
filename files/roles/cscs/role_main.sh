for i in `echo $WAT_ENV_FILES | tr ' ' '\n'` ; do source $i > /dev/null 2>&1 ; done
echo running > status
date > starttime
chmod +x cscs_inner_run.sh
chmod +x cscs_detach.sh
sbatch cscs_detach.sh
