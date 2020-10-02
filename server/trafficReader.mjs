// var pcap = require('pcap');
import * as pcap from "pcap";

class TrafficReader {
    constructor(networkInterface) {
        const pcap_session = pcap.createSession(networkInterface, { filter: "icmp" });

        /*
        Ping: eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.68.66  netmask 255.255.255.240  broadcast 192.168.68.79

        from windows, to see packets arrive.
        */

        let i = 0;
        pcap_session.on('packet', function (raw_packet) {
            var packet = pcap.decode.packet(raw_packet);
            console.log(i, " ICMP Packet: " + "raw_packet.buf.length" + " bytes.");
            i++;
            // console.log(packet.payload.payload.payload);
        });
        console.log("listening for packets at: " + networkInterface)
    }

}
export default TrafficReader;