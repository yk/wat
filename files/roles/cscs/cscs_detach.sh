#!/bin/bash -l
#SBATCH --time=1:00:0
#SBATCH --nodes=1
#SBATCH --mem=8000M
#SBATCH --output=stdout.txt
#SBATCH --error=stderr.txt
#SBATCH --cpus-per-task=4
#SBATCH --ntasks-per-node=1

module load slurm
aprun -b -B cscs_inner_run.sh

