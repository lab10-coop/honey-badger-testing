# honey-badger-testing

A collection of scripts to test the Honey Badger BFT integration in Parity

See: https://github.com/artis-eco/wiki/wiki/Honey-Badger-BFT-Hypothesis-Testing

# Test Scripts

The test scripts are implemented using node.js v10, install and run as usual:

```
npm ci
```

Then either run
```
npm run keepalive-nowait
```
or 
```
npm run keepalive-wait
```

Where the "wait" version waits until the rpc server incremented the transaction nonce, while the "nowait" script version increments the nonce without waiting for the rpc server.

# Testnet Setup Scripts

This repository contains scripts to automatically generate config files to set up a hbbft test network of arbitrary size.

## Introduction

We are using Docker to quickly spin up and down a test network of any size.

One desired property of the setup is the ability to replace individual Docker nodes with locally running nodes for the purpose of interactive debugging.

We achieve this property by mapping the nodes' port to the Docker bridge address, and let all nodes communicate through this bridge address. Locally running nodes can bind to that interface as well, allowing for a mix of Docker and local nodes.

## Usage

Requirements:
* The following repositories cloned at the same directory level as this repository
  * git@github.com:lab10-coop/parity-ethereum.git
  * git@github.com:lab10-coop/posdao-test-setup.git
* Python >=v3.6
* Docker

To generate the configs for n nodes cd into this repository and execute:
```
cd pumba
./setup_testnet.py n
```
Where "n" has to be replaced by a number >=1 denoting the number of validator node configs to generate.

The script also supports generating configs for nat/extip setups. Simply add the external ip address as argument to the script.
```
./setup_testnet.py n ext_ip
```
Where "ext_ip" has to replaced by the external IP address to use.

## Folder Structure

To be compatible with both local and Docker nodes we have to use an appropriate directory structure.

For the sake of simplicity we choose a single directory containing all configs and data to be mounted into a Docker volume.

Caveat: Filesystem performance inside of a Docker volume may be significantly slower than inside the container. We may re-consider the approach of sharing the "data" folder through a Docker volume for that reason.
