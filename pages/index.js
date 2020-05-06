import React, { Component } from "react";

import UnitContainer from "./components/unitContainer";
import Header from "./components/header";

class Index extends Component {
  state = {
    units: [
      {
        data: {
          uid: "3244ff730e03169f0c3e720",
          mac: "5f4-123f-323f-32",
          description: "windows 10 pc",
          type: false
        },
        el: undefined
      },
      {
        data: {
          uid: "5eb1581730e03167f0c3e921",
          mac: "123-123f-53f-32",
          description: "mac osX pc",
          type: false
        },
        el: undefined
      },
      {
        data: {
          uid: "32133730e03fsdf",
          mac: "555-78f-53f-923",
          description: "Android",
          type: true
        },
        el: undefined
      }
    ],
    holdingLocation: { x: 0, y: 0, index: null }
  };
  isHolding = false;
  shouldUpdate = false;
  onUnitClick = uid => {
    this.isHolding = true;
    const t = 0.5;
    const timeout = setTimeout(() => {
      if (this.isHolding) {
        this.shouldUpdate = true;
        this.setState({ holdingLocation: { x: 0, y: 0, uid: uid } });
      } else {
        clearTimeout(timeout);
      }
    }, t * 1000);
  };
  curMousePos = { x: 0, y: 0 };
  componentDidMount() {
    window.addEventListener("mouseup", ev => {
      this.isHolding = false;
      this.shouldUpdate = false;
      this.setState({ holdingLocation: { x: 0, y: 0, uid: null } });
    });
    window.addEventListener("mousemove", ev => {
      if (this.isHolding) {
        this.curMousePos = { x: ev.clientX, y: ev.clientY };
      }
    });
    var fpsInterval, now, then, elapsed;
    fpsInterval = 1000 / 30;
    then = Date.now();
    const animate = () => {
      window.requestAnimationFrame(animate);
      now = Date.now();
      elapsed = now - then;
      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        this.update(elapsed / 1000);
      }
    };
    animate();
  }
  moveSpeed = 1;
  update = deltaTime => {
    if (this.shouldUpdate) {
      //   const oldMousePos = this.state.holdingLocation;

      const holdingLocation = this.state.holdingLocation;
      const newLocation = {
        x: this.curMousePos.x * this.moveSpeed,
        y: this.curMousePos.y * this.moveSpeed,
        uid: holdingLocation.uid
      };
      this.setState({ holdingLocation: newLocation });
    }
  };
  unitInit = (uid, el) => {
    const newUnits = [...this.state.units];
    const found = newUnits.find(unit => unit.data.uid === uid);
    found.el = el;
    this.setState({ units: newUnits });
    console.log(uid, el);
  };
  render() {
    return (
      <div className="bg-gray-800 h-screen">
        <Header />

        <div className="flex p-2">
          <UnitContainer
            title="Active users"
            type={false}
            units={this.state.units.filter(u => u.data.type === false)}
            onUnitClick={this.onUnitClick}
            onUnitInit={this.unitInit}
            holdingLocation={this.state.holdingLocation}
          />
          <UnitContainer
            title="Blocked users"
            type={true}
            units={this.state.units.filter(u => u.data.type === true)}
            onUnitClick={this.onUnitClick}
            onUnitInit={this.unitInit}
            holdingLocation={this.state.holdingLocation}
          />
        </div>
      </div>
    );
  }
}

export default Index;
