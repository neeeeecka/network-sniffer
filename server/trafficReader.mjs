// var pcap = require('pcap');
import * as pcap from "pcap";

class TrafficReader {
    constructor(networkInterface) {
        this.pcap_session = pcap.createSession(networkInterface, {});
        this.pcap_session.on('packet', function (raw_packet) {
            // console.log(raw_packet);
        });
        console.log("listening for packets at: " + networkInterface)
    }

}
export default TrafficReader;