import React, { Component } from "react";
import Header from "./components/header";
import Units from "./components/units";
import io from "socket.io-client";

const cURL = "http://localhost:2999";

class Index extends Component {
  state = {
    filter: ""
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
  updateFilter = (e) => {
    this.setState({filter: e.target.value}, () => {
      this.socket.emit("filter", this.state.filter);
    });
  }
  render() {
    return (
      <div className="bg-gray-800 h-screen  overflow-hidden">
        <Header />
        <content className = "flex">
          <span className = "flex flex-1 mx-2 mt-2">
            <input className = "w-full px-3 py-1 focus:outline-none" type = "text" placeholder="filter" onChange = {this.updateFilter} value = {this.state.filter}/>
            <button className = "bg-gray-100 hover:ng-gray-300 px-3 border-2 focus:outline-none">Update</button>
          </span>
        </content>
      </div>
    );
  }
}


export default Index;
