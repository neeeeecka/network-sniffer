import React, { Component } from "react";
import Header from "./components/header";
import PacketList from "./components/packetList";
import io from "socket.io-client";
import HexDump from "./components/hexDump";

const savedPackets = [];

const socket = io("http://localhost:3009");

function asyncEmit(eventName, data) {
  return new Promise(function (resolve, reject) {
    socket.emit(eventName, data);
    socket.on(eventName, result => {
      socket.off(eventName);
      resolve(result);
    });
    setTimeout(reject, 1000);
  });
}

class Index extends Component {
  state = {
    filter: "",
    currentPacketInspect: null,
    currentPacketDump: null,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    socket.on('connect', () => {
      console.log("Connected to ws server. my id: ", socket.id);
    });

  };
  componentWillUnmount = () => {
    socket.emit("disconnectMe", null);
  }

  updateFilter = (e) => {
    this.setState({ filter: e.target.value }, () => {
      socket.emit("filter", this.state.filter);
    });
  }

  inspectPacket = async (packet) => {
    savedPackets.push(packet);
    this.setState({ currentPacketInspect: packet });

    if (this.state.currentPacketInspect) {
      const raw_buffer = this.state.currentPacketInspect.buffer;
      // socket.emit("decodeBuffer", raw_buffer);
      const decoded = await asyncEmit("decodeBuffer", raw_buffer);
      console.log(decoded);
      this.setState({ currentPacketDump: decoded });
    }
  }


  getCurrentInspectPacket = () => {
    if (this.state.currentPacketDump) {
      return <HexDump hexDump={this.state.currentPacketDump} />
    }
    return null;
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
          <PacketList socket={socket} inspectPacket={this.inspectPacket} />
          <div className="mt-2 bg-gray-100 overflow-auto " style={{ height: "150px" }}>
            {this.getCurrentInspectPacket()}
          </div>
        </content>
      </div>
    );
  }
}

export default Index;
