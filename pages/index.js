import React, { Component } from "react";
import Header from "./components/header";
import PacketList from "./components/packetList";
import io from "socket.io-client";

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
    currentPacketDump: null
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
      const dom = [];
      const splitLines = this.state.currentPacketDump.split(/\r?\n/);
      splitLines.forEach((line, i) => {
        const colon = line.indexOf(":");
        const lineStart = line.substring(0, colon);
        const lineHex = line.substring(colon + 2, colon + 1 + 4 * 8 + 8);
        const lineAscii = line.substring(colon + 1 + 4 * 8 + 8, line.length);

        const lineHexDom = [];
        const lineAsciiDom = [];

        let lineHexSplit = lineHex.split(" ");
        console.log(lineHexSplit)
        for (let i = 0; i < 8; i++) {
          lineHexDom.push(
            <span key={i} className="px-2 py-1 hover:bg-blue-400">{lineHexSplit[i]}</span>
          );
        }

        dom.push(<tr key={i}>
          <td>{lineStart}</td>
          <td>{lineHexDom}</td>
          <td>{lineAscii}</td>
        </tr>);

      });
      return <table className="block hexdump"><tbody>{dom}</tbody></table>;
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
