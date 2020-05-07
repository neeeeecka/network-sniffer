import React, { Component } from "react";
import UnitContainer from "./components/unitContainer";
import Header from "./components/header";
import Rectangle from "./Rectangle";
import Vector2 from "./Vector2";
import FrameHandler from "./FrameHandler";

class Index extends Component {
  state = {
    units: [
      {
        data: {
          uid: "3244ff730e03169f0c3e720",
          mac: "5f4-123f-323f-32",
          description: "windows 10 pc",
          type: "active"
        },
        el: undefined
      },
      {
        data: {
          uid: "5eb1581730e03167f0c3e921",
          mac: "123-123f-53f-32",
          description: "mac osX pc",
          type: "active"
        },
        el: undefined
      },
      {
        data: {
          uid: "32133730e03fsdf",
          mac: "555-78f-53f-923",
          description: "Android",
          type: "blocked"
        },
        el: undefined
      }
    ],
    containers: {
      active: null,
      blocked: null
    },
    holdingLocation: {
      rect: new Rectangle(new Vector2(0, 0), new Vector2(0, 0)),
      startOffset: new Vector2(0, 0),
      curMousePos: new Vector2(0, 0),
      uid: null,
      isAnim: false,
      isHolded: false
    },
    selectedUnit: undefined,
    isHolding: false,
    shouldUpdate: false
  };
  onUnitClick = (uid, ev) => {
    this.setState({ isHolding: true });
    const t = 0.025;
    ev.persist();
    const timeout = setTimeout(() => {
      if (this.state.isHolding) {
        const unit = this.state.units.find(unit => unit.data.uid === uid);
        const cRect = unit.el.getBoundingClientRect();
        this.curMousePos = new Vector2(ev.clientX, ev.clientY);
        this.lastMousePos = this.curMousePos;

        const newRect = new Rectangle(
          new Vector2(0, 0),
          new Vector2(unit.el.offsetWidth, unit.el.offsetHeight)
        );
        if (!this.debugId) {
          this.debugId = newRect.debug("rgba(255,103,27, 0.7)");
        }
        const newHoldingState = { ...this.state.holdingLocation };
        newHoldingState.rect = newRect;
        newHoldingState.startOffset = new Vector2(cRect.left, cRect.top);
        newHoldingState.uid = uid;
        newHoldingState.isHolded = true;

        this.setState({
          holdingLocation: newHoldingState,
          selectedUnit: unit,
          shouldUpdate: true
        });
      } else {
        clearTimeout(timeout);
      }
    }, t * 1000);
  };
  curMousePos = new Vector2(0, 0);
  componentDidMount() {
    window.addEventListener("mouseup", ev => {
      const holdState = this.state.holdingLocation;

      if (this.state.isHolding && this.state.selectedUnit) {
        const containers = this.state.containers;
        let activeCont = undefined;
        Object.keys(this.state.containers).forEach(key => {
          if (this.state.containers[key]) {
            activeCont = key;
          }
        });
        const newUnits = [...this.state.units];
        const selectedUnit = newUnits.find(unit => {
          return unit.data.uid === holdState.uid;
        });
        selectedUnit.data.type =
          activeCont !== undefined ? activeCont : selectedUnit.data.type;
        console.log(selectedUnit.data.type);

        this.setState({ units: newUnits });
      }
      const newContainers = { active: false, blocked: false };
      let newHoldingState = { ...this.state.holdingLocation };
      newHoldingState.rect = new Rectangle(
        new Vector2(0, 0),
        new Vector2(0, 0)
      );
      newHoldingState.isAnim = true;
      newHoldingState.isHolded = false;
      newHoldingState.startOffset = new Vector2(0, 0);
      newHoldingState.cursorPos = new Vector2(0, 0);
      this.setState(
        {
          containers: newContainers,
          holdingLocation: newHoldingState,
          isHolding: false,
          shouldUpdate: false,
          selectedUnit: undefined
        },
        () => {
          const t = setTimeout(() => {
            newHoldingState.uid = null;
            newHoldingState.isAnim = false;

            this.setState({
              holdingLocation: newHoldingState
            });
            clearTimeout(t);
          }, 0.25 * 1000);
        }
      );
    });
    window.addEventListener("mousemove", ev => {
      if (this.state.isHolding) {
        this.curMousePos.modify(ev.clientX, ev.clientY);
      }
    });
    const frameHandler = new FrameHandler(30, this.update);
  }
  selectedUnit = { initialPos: { x: 0, y: 0 } };
  moveSpeed = 1;

  lastMousePos = { x: 0, y: 0 };
  debugId = null;
  update = deltaTime => {
    if (this.state.shouldUpdate) {
      const movement = this.curMousePos.subtract(this.lastMousePos);
      this.lastMousePos = this.curMousePos.clone();

      const holdState = this.state.holdingLocation;
      const newRect = holdState.rect.clone();

      newRect.xy.addTo(movement);
      newRect.collisionOffset = holdState.startOffset;

      const newHoldState = {
        rect: newRect,
        startOffset: holdState.startOffset,
        cursorPos: this.curMousePos,
        uid: holdState.uid,
        isHolded: true
      };

      const containers = { active: false, blocked: false };
      if (this.falseContainer.rect.intersectsPoint(this.curMousePos)) {
        containers.active = true;
      }
      if (this.trueContainer.rect.intersectsPoint(this.curMousePos)) {
        containers.blocked = true;
      }

      newHoldState.rect.debugAt(this.debugId);

      this.setState({ holdingLocation: newHoldState, containers: containers });
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
  falseContainer = null;
  trueContainer = null;

  initCont = (el, type) => {
    const rect = el.getBoundingClientRect();
    const container = {
      el: el,
      rect: new Rectangle(
        new Vector2(rect.left, rect.top),
        new Vector2(el.offsetWidth, el.offsetHeight)
      )
    };
    if (type) {
      this.trueContainer = container;
    } else {
      this.falseContainer = container;
    }
  };

  render() {
    return (
      <div className="bg-gray-800 h-screen  overflow-hidden">
        <div
          id="rectDebugger"
          style={{
            overflow: "hidden",
            width: "100%",
            height: "100%",
            position: "absolute"
          }}
        />
        <Header />
        <div className="flex p-2">
          <UnitContainer
            title="Active users"
            units={this.state.units.filter(u => u.data.type === "active")}
            onUnitClick={this.onUnitClick}
            onInit={el => {
              this.initCont(el, false);
            }}
            onUnitInit={this.unitInit}
            holdState={this.state.holdingLocation}
            expand={this.state.containers.active}
          />
          <UnitContainer
            title="Blocked users"
            units={this.state.units.filter(u => u.data.type === "blocked")}
            onUnitClick={this.onUnitClick}
            onInit={el => {
              this.initCont(el, true);
            }}
            onUnitInit={this.unitInit}
            holdState={this.state.holdingLocation}
            expand={this.state.containers.blocked}
          />
        </div>
      </div>
    );
  }
}

export default Index;
