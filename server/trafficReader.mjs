// var pcap = require('pcap');
import * as pcap from "pcap";

class TrafficReader {
    constructor(networkInterface, io) {
        const pcap_session = pcap.createSession(networkInterface, { filter: "" });

        pcap_session.on('packet', function (raw_packet) {
            var packet = pcap.decode.packet(raw_packet);
            // console.log(" ICMP Packet: " + "raw_packet.buf.length" + " bytes.");
            // i++;
            // console.log(raw_packet);
           io.emit("packet", packet);
        //    console.log(packet);
                
        });
        console.log("listening for packets at: " + networkInterface)
    }

}
export default TrafficReader;