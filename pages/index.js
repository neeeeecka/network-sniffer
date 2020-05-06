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
    holdingLocation: {
      x: 0,
      y: 0,
      uid: null,
      anchor: { x: 0, y: 0 },
      isAnim: false
    },
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
        this.curMousePos = {
          x: ev.clientX,
          y: ev.clientY
        };
        const rect = unit.el.getBoundingClientRect();
        this.lastMousePos = this.curMousePos;

        this.setState({
          holdingLocation: {
            x: 0,
            y: 0,
            uid: uid,
            ax: rect.left,
            ay: rect.top,
            rx: this.curMousePos.x - rect.left,
            ry: this.curMousePos.y - rect.top,
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
      const holdingLocation = this.state.holdingLocation;
      this.setState(
        {
          holdingLocation: {
            x: 0,
            y: 0,
            uid: holdingLocation.uid,
            isAnim: true
          },
          isHolding: false,
          shouldUpdate: false
        },
        () => {
          const t = setTimeout(() => {
            this.setState({
              holdingLocation: { x: 0, y: 0, uid: null, isAnim: false }
            });
            clearTimeout(t);
          }, 2.5 * 1000);
        }
      );
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

  lastMousePos = { x: 0, y: 0 };
  update = deltaTime => {
    if (this.state.shouldUpdate) {
      //   const oldMousePos = this.state.holdingLocation;
      const currentMousePos = this.curMousePos;

      const movement = {
        x: currentMousePos.x - this.lastMousePos.x,
        y: currentMousePos.y - this.lastMousePos.y
      };
      console.log(movement);

      this.lastMousePos = currentMousePos;

      const holdingLocation = this.state.holdingLocation;
      const newLocation = {
        // x: this.curMousePos.x - holdingLocation.ax - holdingLocation.rx,
        // y: this.curMousePos.y - holdingLocation.ay - holdingLocation.ry,
        x: holdingLocation.x + movement.x,
        y: holdingLocation.y + movement.y,
        ax: holdingLocation.ax,
        ay: holdingLocation.ay,
        rx: holdingLocation.rx,
        ry: holdingLocation.ry,
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
