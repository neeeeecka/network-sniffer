import React, { Component } from "react";
import Header from "./components/header";
import Units from "./components/units";

function array_move(arr, old_index, new_index) {
  if (new_index > 0 && new_index > old_index) {
    arr.splice(new_index - 1, 0, arr.splice(old_index, 1)[0]);
  } else {
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  }
}

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

  componentDidMount = async () => {};
  render() {
    return (
      <div className="bg-gray-800 h-screen  overflow-hidden">
        <Header />
      </div>
    );
  }
}

export default Index;
