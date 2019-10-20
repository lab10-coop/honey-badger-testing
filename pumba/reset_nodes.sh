for d in containers/*/ ; do
    rm -f ${d}parity.log
    rm -rfd ${d}data/chains    
done
