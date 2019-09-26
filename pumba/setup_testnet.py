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

cmd = ['cargo', 'run', str(num_nodes), "Docker"]
if len(sys.argv) > 2:
    cmd.append(sys.argv[2])

run_cmd(cmd, generator_dir)

# Set up validator nodes
for i in range(1, num_nodes + 1):
    print("Setting up config for node {}".format(i))
    os.makedirs("containers/node{}/data/network".format(i), exist_ok=True)
    os.makedirs("containers/node{}/data/keys/DPoSChain".format(i), exist_ok=True)
    copyfile(generator_dir + "/hbbft_validator_{}.toml".format(i), "containers/node{}/node.toml".format(i))
    copyfile(generator_dir + "/hbbft_validator_key_{}".format(i), "containers/node{}/data/network/key".format(i))
    copyfile(generator_dir + "/reserved-peers", "containers/node{}/reserved-peers".format(i))
    copyfile("../../posdao-test-setup/spec/spec.json", "containers/node{}/spec.json".format(i))
    copyfile(generator_dir + "/password.txt", "containers/node{}/password.txt".format(i))
    copyfile(generator_dir + "/hbbft_validator_key_{}.json".format(i), "containers/node{}/data/keys/DPoSChain/hbbft_validator_key.json".format(i))    
    
# Set up Rpc node
os.makedirs("containers/rpc_node", exist_ok=True)
copyfile(generator_dir + "/rpc_node.toml", "containers/rpc_node/node.toml")
copyfile(generator_dir + "/reserved-peers", "containers/rpc_node/reserved-peers")
copyfile("../../posdao-test-setup/spec/spec.json", "containers/rpc_node/spec.json")
