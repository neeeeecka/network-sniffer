import React, { Component } from "react";
import Header from "./organs/header";
import PacketList from "./organs/packetList";
import io from "socket.io-client";
import HexDump from "./organs/hexDump";
import "core-js/stable";
import "regenerator-runtime";

const savedPackets = [];

const socket = io.connect("http://localhost:5000");

function asyncEmit(eventName, data) {
  return new Promise(function (resolve, reject) {
    socket.emit(eventName, data);
    socket.on(eventName, (result) => {
      socket.off(eventName);
      resolve(result);
    });
    setTimeout(reject, 5000);
  });
}

class App extends Component {
  state = {
    filter: "",
    currentPacketInspect: null,
    currentPacketDump: null,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    socket.on("connect", () => {
      console.log("Connected to ws server. my id: ", socket.id);
    });
  };
  componentWillUnmount = () => {
    socket.emit("disconnectMe", null);
  };

  updateFilter = (e) => {
    this.setState({ filter: e.target.value }, () => {
      socket.emit("filter", this.state.filter);
    });
  };

  inspectPacket = async (packet) => {
    savedPackets.push(packet);
    this.setState({ currentPacketInspect: packet }, async () => {
      if (this.state.currentPacketInspect) {
        const raw_buffer = this.state.currentPacketInspect.buffer;
        // socket.emit("decodeBuffer", raw_buffer);
        const decoded = await asyncEmit("decodeBuffer", raw_buffer);
        packet.uid = parseInt(Math.random() * 1000);
        console.log(decoded);
        this.setState({ currentPacketDump: decoded });
      }
    });
  };

  getCurrentInspectPacket = () => {
    if (this.state.currentPacketDump) {
      return (
        <HexDump
          hexDump={this.state.currentPacketDump}
          uid={this.state.currentPacketInspect.uid}
        />
      );
    }
    return null;
  };

  render() {
    return (
      <div className="bg-gray-800 h-screen flex flex-col overflow-hidden">
        <Header />
        <div className="flex flex-col m-2 flex-1">
          <span className="flex">
            <input
              className="w-full px-3 py-1 focus:outline-none"
              type="text"
              placeholder="filter"
              onChange={this.updateFilter}
              value={this.state.filter}
            />
            <button className="bg-gray-100 hover:bg-gray-400 active:bg-gray-500 px-3 border-2 focus:outline-none">
              Update
            </button>
          </span>
          <PacketList socket={socket} inspectPacket={this.inspectPacket} />
          <div
            className="mt-2 bg-gray-100 overflow-auto "
            style={{ height: "150px" }}
          >
            {this.getCurrentInspectPacket()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
