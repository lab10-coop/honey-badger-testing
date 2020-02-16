# Generate Test Network Configs

Prerequisites:
* node.js
* Rust

The `setup_testnet.py` script runs the `hbbft_config_generator` contained in the `parity-ethereum` repository as well as the `make_spec_hbbft.js` script contained in the `posdao-contracts` repository.

Both the `parity-ethereum` and the `posdao-contracts` repositories need to be checked out at the same directory level as this repository.

Currently these are:
* `https://github.com/lab10-coop/posdao-contracts` at the `df-hbbft-spec-automation` branch 
* `https://github.com/lab10-coop/parity-ethereum` at the `df-synckeygen-contract` branch

After cloning parity-ethereum at the right branch build parity using:
```
cargo build --release
```

Next clone and enter enter the `posdao-contracts` repository folder and install the necessary npm dependencies:
```
npm i
```

Then you can enter the folder of this docs file and run the test network setup script:
```
./setup_testnet.py <n>
```

Which will generate parity configs and the hbbft chain spec and copy them into a sub-folder called "containers".

These can be started by using the `run_local.sh <n>` and/or the `run_rpc_local.sh` scripts.

### Adjust reserved-peers

The `setup_testnet.py` script generates config to be run on a local machine.
If the intent is to run the nodes on dedicated machines the `reserved-peers` file needs to be adjusted accordingly.

Also make sure to adjust the `networks` setting in the node.toml files to make the nodes listen to the public IP addresses

### Adjust chain spec for running keepalive tests

To customize the chain spec file modify the `templates/spec_hbbft.json` file in the `posdao-contracts` repository.

Note that these modifications need to be done **before** running the `./setup_testnet.py` script.

To add the accounts expected by the `keepalive` tests add the following two accounts to the `spec_hbbft.json` template:
```
    "0x32e4e4c7c5d1cea5db5f9202a9e4d99e56c91a24": { 
      "balance": "1606938044258990275541962092341162602522202993782792835301376", 
      "nonce": "1048576" 
    },
    "0x0102ac5315c1bd986a1da4f1fe1b4bca36fa4667": { 
      "balance": "1606938044258990275541962092341162602522202993782792835301376", 
      "nonce": "1048576" 
    },
```