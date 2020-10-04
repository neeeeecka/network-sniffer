import React, { Component } from "react";
import Resizable from "./resizable";

const packetColors = {
    "udp": "bg-blue-200",
    "tcp": "bg-green-200"
};

let socket = null;

class PacketList extends Component {
    state = {
        packets: [],
        tdWidths: [0, 0, 0, 0]
    };
    constructor(props) {
        super(props);
        socket = this.props.socket;
    }
    componentDidMount = (props) => {
        console.log(props);
        socket.on("packet", (data) => {
            // console.log(data);

            if (data.payload.payload.decoderName == "ipv4") {
                let newPackets = [...this.state.packets];
                const transportLayer = data.payload.payload.payload;

                const destination = data.payload.payload.daddr.addr.join(".");
                const source = data.payload.payload.saddr.addr.join(".");

                let length = 0;
                let buffer = transportLayer.data;
                if (transportLayer.decoderName == "tcp") {
                    length = transportLayer.dataLength;
                    // buffer = transportLayer.data;
                }
                if (transportLayer.decoderName == "udp") {
                    length = transportLayer.length;
                    // console.log(transportLayer.data);
                }
                newPackets.push({ source: source, destination: destination, protocol: transportLayer.decoderName, length: length, buffer: buffer });

                newPackets = newPackets.slice(newPackets.length - 50, newPackets.length);
                this.setState({ packets: newPackets });
                // console.log(buffer);
            }
        });
    }
    setTdWidth = (td, width) => {
        const newTdWidths = [...this.state.tdWidths];
        newTdWidths[td] = width;

        this.setState({ tdWidths: newTdWidths });
    }
    getPacketsFor = (index) => {
        const domPackets = [];
        this.state.packets.forEach((packet, i) => {
            domPackets.push(
                <span onClick={() => this.inspectPacket(packet)} className={"hover:bg-gray-300 active:bg-gray-400 cursor-pointer flex " + (packetColors[packet.protocol])} key={i}>
                    <Resizable width={this.state.tdWidths[0]}>{packet.source}</Resizable>
                    <Resizable width={this.state.tdWidths[1]}>{packet.destination}</Resizable>
                    <Resizable width={this.state.tdWidths[2]}>{packet.protocol}</Resizable>
                    <Resizable width={this.state.tdWidths[3]}>{packet.length}</Resizable>
                </span>
            );
        });
        return domPackets;
    }
    render = () => {
        return <React.Fragment>
            <span className="text-gray-200 font-bold my-1">
                <Resizable i="0" setTdWidth={this.setTdWidth}>Source</Resizable>
                <Resizable i="1" setTdWidth={this.setTdWidth}>Destination</Resizable>
                <Resizable i="2" setTdWidth={this.setTdWidth}>Protocol</Resizable>
                <Resizable i="3" setTdWidth={this.setTdWidth}>Length</Resizable>
            </span>
            <div className="bg-gray-100 flex-1 flex-col overflow-auto " style={{ flex: "0 0 calc(100vh - 285px)" }}>
                {this.getPacketsFor(0)}
            </div>
        </React.Fragment>;
    }
}
export default PacketList;