import React, { Component } from "react";

import UnitContainer from "./components/unitContainer";
import Header from "./components/header";

class Index extends Component {
  state = {
    units: [
      {
        uid: "3244ff730e03169f0c3e720",
        mac: "5f4-123f-323f-32",
        description: "windows 10 pc",
        limit: 0.5,
        type: false
      },
      {
        uid: "5eb1581730e03167f0c3e921",
        mac: "123-123f-53f-32",
        description: "mac osX pc",
        limit: 0.5,
        type: false
      }
    ]
  };
  onUnitClick = (index, container) => {
    console.log(index, container);
  };
  render() {
    return (
      <div className="bg-gray-800 h-screen">
        <Header />

        <div className="flex p-2">
          <UnitContainer
            title="Active users"
            type={false}
            units={this.state.units.filter(u => u.type === false)}
            onUnitClick={this.onUnitClick}
          />
          <UnitContainer
            title="Blocked users"
            type={true}
            units={this.state.units.filter(u => u.type === true)}
            onUnitClick={this.onUnitClick}
          />
        </div>
      </div>
    );
  }
}

export default Index;
