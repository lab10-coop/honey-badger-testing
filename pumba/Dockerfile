FROM ubuntu:xenial

# install tools and dependencies
RUN apt-get -y update && \
	apt-get upgrade -y && \
	apt-get install -y --no-install-recommends \
		curl make cmake git file ca-certificates \
		g++ libudev-dev \
		&& \
	apt-get clean

# install rustup
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

# rustup directory
ENV PATH /root/.cargo/bin:$PATH

# show backtraces
ENV RUST_BACKTRACE 1

# show tools
RUN rustc -vV && cargo -V

# add binary from local build
ADD parity /

# checkout parity repo
#RUN git clone https://github.com/lab10-coop/parity-ethereum.git

# volume to contain node config and spec/data/keys
VOLUME /node

EXPOSE 8080 8545 8180
ENTRYPOINT ["/parity"]
