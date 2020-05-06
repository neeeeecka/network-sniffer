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
        type: false
      },
      {
        uid: "5eb1581730e03167f0c3e921",
        mac: "123-123f-53f-32",
        description: "mac osX pc",
        type: false
      },
      {
        uid: "32133730e03fsdf",
        mac: "555-78f-53f-923",
        description: "Android",
        type: true
      }
    ],
    holdingLocation: { x: 0, y: 0, index: null }
  };
  isHolding = false;
  onUnitClick = uid => {
    this.isHolding = true;
    const t = 0.5;
    const timeout = setTimeout(() => {
      if (this.isHolding) {
        this.setState({ holdingLocation: { x: 0, y: 0, uid: uid } });
      } else {
        clearTimeout(timeout);
      }
    }, t * 1000);
  };
  componentDidMount() {
    window.addEventListener("mouseup", ev => {
      this.isHolding = false;
      this.setState({ holdingLocation: { x: 0, y: 0, uid: null } });
    });
  }
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
            holdingLocation={this.state.holdingLocation}
          />
          <UnitContainer
            title="Blocked users"
            type={true}
            units={this.state.units.filter(u => u.type === true)}
            onUnitClick={this.onUnitClick}
            holdingLocation={this.state.holdingLocation}
          />
        </div>
      </div>
    );
  }
}

export default Index;
