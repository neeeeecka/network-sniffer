import React, { Component } from "react";
import Header from "./components/header";
import Units from "./components/units";


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

  componentDidMount = async () => { };
  render() {
    return (
      <div className="bg-gray-800 h-screen  overflow-hidden">
        <Header />
      </div>
    );
  }
}


export default Index;
