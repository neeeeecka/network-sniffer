import React, { Component } from "react";
import Header from "./components/header";
import Units from "./components/units";
import io from "socket.io-client";

const cURL = "http://localhost:2999";

class Index extends Component {
  state = {
    units: [
      // {
      //   data: {
      //     _id: "3244ff730e03169f0c3e720",
      //     mac: "5f4-123f-323f-32",
      //     description: "windows 10 pc",
      //     type: "active"
      //   },
      //   el: undefined,
      //   sortIndex: 0
      // }
    ]
  };

  componentDidMount = async () => { 
    const socket = io("http://localhost:2999");
    socket.on('connect', () => {
      console.log("Connected to ws server. my id: ", socket.id);
    });
    socket.on("packet", (data) => {
      console.log(data);
      socket.emit("socketAnswer", null);
    });
    console.log(socket);
    this.socket = socket;
  };
  componentWillUnmount = () =>{
    this.socket.emit("disconnectMe", null);
  }
  render() {
    return (
      <div className="bg-gray-800 h-screen  overflow-hidden">
        <Header />
      </div>
    );
  }
}


export default Index;
