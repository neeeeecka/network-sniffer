import React, { Component } from "react";
import Header from "./components/header";
import PacketList from "./components/packetList";
import io from "socket.io-client";

const cURL = "http://localhost:2999";


let cached = [];
let firstCall = true;
const savedPackets = [];

const socket = io("http://localhost:2999");

class Index extends Component {
  state = {
    filter: "",
    currentPacketInspect: null,
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

  inspectPacket = (packet) => {
    savedPackets.push(packet);
    this.setState({ currentPacketInspect: packet });
  }

  getCurrentInspectPacket = () => {
    if (this.state.currentPacketInspect) {
      console.log(this.state.currentPacketInspect.buffer);
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
          {/* <div className="bg-gray-100 flex-1 flex-col overflow-auto " style={{ flex: "0 0 calc(100vh - 285px)" }}>
            {this.getPacketsFor(0)}
          </div> */}
          <PacketList socket={socket} />
          <div className="mt-2 bg-gray-100" style={{ height: "150px" }}>
            {this.getCurrentInspectPacket()}
          </div>
        </content>
      </div>
    );
  }
}

export default Index;
