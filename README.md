# honey-badger-testing

A collection of scripts to test the Honey Badger BFT integration in Parity

# Test Scripts

## Requirements

* node.js v10

# Testnet Setup Scripts

This repository contains scripts to automatically generate config files to set up a hbbft test network of arbitrary size.

## Introduction

We are using Docker to quickly spin up and down a test network of any size.

One desired property of the setup is the ability to replace individual Docker nodes with locally running nodes for the purpose of interactive debugging.

We achieve this property by mapping the nodes' port to the Docker bridge address, and let all nodes communicate through this bridge address. Locally running nodes can bind to that interface as well, allowing for a mix of Docker and local nodes.

## Project Structure

To be compatible with both local and Docker nodes we have to use an appropriate directory structure.

For the sake of simplicity we choose a single directory containing all configs and data to be mounted into a Docker volume.

Caveat: Filesystem performance inside of a Docker volume may be significantly slower than inside the container. We may re-consider the approach of sharing the "data" folder through a Docker volume for that reason.

## Requirements

* The following repositories cloned at the same directory level as this repository
  * "ethereum-parity"
  * "posdao-test-setup"
* Python >=v3.6
* Docker

## setup_testnet.py

Simply execute giving the desired number of hbbft validator nodes as argument:

To create a hbbft test network of size 4 for example:
`setup_testnet.py 4`

