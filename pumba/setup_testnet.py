#!/usr/bin/python3

import os
import subprocess
import sys
from shutil import copyfile

num_nodes = int(sys.argv[1])

def run_cmd(args, cwd=None):
    p = subprocess.Popen(args, cwd=cwd)
    p.wait()

print('Generating Docker config volume folders for {num_nodes} hbbft nodes'.format(num_nodes=num_nodes))

generator_dir = '../../parity-ethereum/ethcore/hbbft_engine/hbbft_config_generator'

run_cmd(['cargo', 'run', str(num_nodes)], generator_dir)

for i in range(1, num_nodes + 1):
    print("Setting up config for node {}".format(i))
    os.makedirs("containers/node{}/data/network".format(i), exist_ok=True)
    copyfile(generator_dir + "/hbbft_validator_{}.toml".format(i), "containers/node{}/node.toml".format(i))
    copyfile(generator_dir + "/hbbft_validator_key_{}".format(i), "containers/node{}/data/network/key".format(i))
