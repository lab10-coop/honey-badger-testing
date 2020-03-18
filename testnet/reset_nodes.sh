for d in nodes/*/ ; do
    rm -f ${d}parity.log
    rm -rfd ${d}data/chains    
done
