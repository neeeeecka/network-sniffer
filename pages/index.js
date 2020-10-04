import React, { Component } from "react";
import Header from "./components/header";
import Units from "./components/units";
import io from "socket.io-client";

import StaticHelpers from "./staticHelpers";

const cURL = "http://localhost:2999";
const packetColors = {
  "udp": "bg-blue-200",
  "tcp": "bg-green-200"
};

let cached = [];
let firstCall = true;
const savedPackets = [];

class Index extends Component {
  state = {
    filter: "",
    packets: [],
    currentPacketInspect: null,
    tdWidths: [0, 0, 0, 0]
  };

  setTdWidth = (td, width) => {
    const newTdWidths = [...this.state.tdWidths];
    newTdWidths[td] = width;

    this.setState({ tdWidths: newTdWidths });
  }

  componentDidMount = async () => {
    const socket = io("http://localhost:2999");
    socket.on('connect', () => {
      console.log("Connected to ws server. my id: ", socket.id);
    });
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
    console.log(socket);
    this.socket = socket;
  };
  componentWillUnmount = () => {
    this.socket.emit("disconnectMe", null);
  }

  updateFilter = (e) => {
    this.setState({ filter: e.target.value }, () => {
      this.socket.emit("filter", this.state.filter);
    });
  }

  inspectPacket = (packet) => {
    savedPackets.push(packet);
    this.setState({ currentPacketInspect: packet });
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
  render() {
    return (
      <div className="bg-gray-800 h-screen flex flex-col overflow-hidden">
        <Header />
        <content className="flex flex-col m-2 flex-1">
          <span className="flex">
            <input className="w-full px-3 py-1 focus:outline-none" type="text" placeholder="filter" onChange={this.updateFilter} value={this.state.filter} />
            <button className="bg-gray-100 hover:bg-gray-400 active:bg-gray-500 px-3 border-2 focus:outline-none">Update</button>
          </span>
          <span className="text-gray-200 font-bold my-1">
            <Resizable i="0" setTdWidth={this.setTdWidth}>Source</Resizable>
            <Resizable i="1" setTdWidth={this.setTdWidth}>Destination</Resizable>
            <Resizable i="2" setTdWidth={this.setTdWidth}>Protocol</Resizable>
            <Resizable i="3" setTdWidth={this.setTdWidth}>Length</Resizable>
          </span>
          <div className="bg-gray-100 flex-1 flex-col overflow-auto " style={{ flex: "0 0 calc(100vh - 285px)" }}>
            {this.getPacketsFor(0)}
          </div>
          <div className="mt-2 bg-gray-100" style={{ height: "150px" }}></div>
        </content>
      </div>
    );
  }
}

let listenerExists = false;

class Resizable extends Component {
  state = {
    holding: false,
    // width: "auto"
    width: "150px"
  }
  clientX = 0;

  minWidth = 20;
  maxWidth = 400;

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  componentDidMount = () => {
    document.body.addEventListener("mouseup", this.mouseUp);
    document.body.addEventListener("mousemove", this.mouseMove);

    this.minWidth = this.ref.clientWidth;
    this.setState({ width: this.minWidth });
    if (this.props.setTdWidth) {
      this.props.setTdWidth(this.props.i, this.minWidth);
    }
  }
  componentWillUnmount = () => {
    document.removeEventListener("mouseup", this.mouseUp);
    document.removeEventListener("mousemove", this.mouseMove);
  }
  mouseUp = (e) => {
    this.setState({ holding: false });
  }
  mouseMove = (e) => {
    if (this.state.holding && this.props.setTdWidth) {
      let deltaX = e.clientX - this.clientX;

      let newWidth = StaticHelpers.clamp(this.state.width + deltaX, this.minWidth, this.maxWidth);
      this.setState({ width: newWidth });

      this.props.setTdWidth(this.props.i, newWidth);

      this.clientX = e.clientX;
    }
  }
  render = () => {
    return <span
      className="td inline-block "
      index={this.props.i}
      style={this.props.width ? { width: this.props.width } : { width: this.state.width }}
      onMouseDown={(e) => {
        this.clientX = e.clientX;
        this.setState({ holding: true });
      }}
      ref={(el) => {
        this.ref = el;
      }}
    >{this.props.children}</span>;
  }
}

export default Index;
