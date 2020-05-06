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
    holdingLocation: { x: 0, y: 0, uid: null, anchor: { x: 0, y: 0 } },
    selectedUnit: { initialPos: { x: 0, y: 0 } },
    isHolding: false,
    shouldUpdate: false
  };
  onUnitClick = (uid, ev) => {
    this.setState({ isHolding: true });
    const t = 0.2;
    ev.persist();
    const timeout = setTimeout(() => {
      if (this.state.isHolding) {
        const unit = this.state.units.find(unit => unit.data.uid === uid);
        this.curMousePos = { x: ev.clientX, y: ev.clientY };
        const rect = unit.el.getBoundingClientRect();

        console.log(this.curMousePos.x, this.curMousePos.y);
        console.log(rect.left, rect.top);
        console.log(unit.el.offsetWidth, unit.el.offsetHeight);

        console.log(
          this.curMousePos.x - rect.left,
          this.curMousePos.y - rect.top
        );

        this.setState({
          holdingLocation: {
            x: 0,
            y: 0,
            uid: uid,
            ax: this.curMousePos.x - rect.left,
            ay: this.curMousePos.y - rect.top,
            w: unit.el.offsetWidth,
            h: unit.el.offsetHeight
          },
          selectedUnit: unit,
          shouldUpdate: true
        });
      } else {
        clearTimeout(timeout);
      }
    }, t * 1000);
  };
  curMousePos = { x: 0, y: 0 };
  componentDidMount() {
    window.addEventListener("mouseup", ev => {
      this.setState({
        holdingLocation: { x: 0, y: 0, uid: null },
        isHolding: false,
        shouldUpdate: false
      });
    });
    window.addEventListener("mousemove", ev => {
      if (this.state.isHolding) {
        this.curMousePos = { x: ev.clientX, y: ev.clientY };
      }
    });
    var fpsInterval, now, then, elapsed;
    fpsInterval = 1000 / 20;
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
  selectedUnit = { initialPos: { x: 0, y: 0 } };
  moveSpeed = 1;
  update = deltaTime => {
    if (this.state.shouldUpdate) {
      //   const oldMousePos = this.state.holdingLocation;

      const holdingLocation = this.state.holdingLocation;
      const newLocation = {
        x: this.curMousePos.x - holdingLocation.ax,
        y: this.curMousePos.y - holdingLocation.ay,
        ax: holdingLocation.ax,
        ay: holdingLocation.ay,
        w: holdingLocation.w,
        h: holdingLocation.h,
        uid: holdingLocation.uid
      };
      this.setState({ holdingLocation: newLocation });
    }
  };
  unitInit = (uid, el) => {
    const newUnits = [...this.state.units];
    const found = newUnits.find(unit => unit.data.uid === uid);
    found.el = el;
    const rect = el.getBoundingClientRect();
    found.initialPos = { x: rect.left, y: rect.top };
    this.setState({ units: newUnits });
  };
  render() {
    return (
      <div className="bg-gray-800 h-screen  overflow-hidden">
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
