import React, { Component } from "react";
import UnitContainer from "./unitContainer";
import Header from "./header";
import Rectangle from "../Rectangle";
import Vector2 from "../Vector2";
import FrameHandler from "../FrameHandler";

class Units extends Component {
  state = {
    containers: {
      active: null,
      blocked: null
    },
    holdingLocation: {
      rect: new Rectangle(new Vector2(0, 0), new Vector2(0, 0)),
      startOffset: new Vector2(0, 0),
      cursorPos: new Vector2(0, 0),
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
        const unit = this.props.units.find(unit => unit.data.uid === uid);
        const cRect = unit.el.getBoundingClientRect();
        this.curMousePos = new Vector2(ev.clientX, ev.clientY);
        this.lastMousePos = this.curMousePos;

        const newRect = new Rectangle(
          new Vector2(cRect.left, cRect.top),
          new Vector2(cRect.width, cRect.height)
        );
        if (!this.debugId) {
          // this.debugId = newRect.debug("rgba(255,103,27, 0.7)");
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

        if (activeCont) {
          this.props.updateUnitType(holdState.uid, activeCont);
        }

        // console.log(selectedUnit.data.type);

        // this.setState({ units: newUnits });
      }
      const newContainers = { active: false, blocked: false };
      let newHoldState = { ...this.state.holdingLocation };
      newHoldState.rect = new Rectangle(new Vector2(0, 0), new Vector2(0, 0));
      newHoldState.isAnim = true;
      newHoldState.isHolded = false;
      newHoldState.startOffset = new Vector2(0, 0);
      newHoldState.cursorPos = new Vector2(0, 0);
      // newHoldState.rect.debugAt(this.debugId);

      this.setState(
        {
          containers: newContainers,
          holdingLocation: newHoldState,
          isHolding: false,
          shouldUpdate: false,
          selectedUnit: undefined
        },
        () => {
          const t = setTimeout(() => {
            newHoldState.uid = null;
            newHoldState.isAnim = false;

            this.setState({
              holdingLocation: newHoldState
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
  setExpandedIndex = index => {
    this.setState({ expandedIndex: index });
  };
  unitInit = (uid, el) => {
    console.log("Re-inited");
    const newUnits = [...this.props.units];
    const found = newUnits.find(unit => unit.data.uid === uid);
    found.el = el;
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
            units={this.props.units.filter(u => u.data.type === "active")}
            onUnitClick={this.onUnitClick}
            onInit={el => {
              this.initCont(el, false);
            }}
            onUnitInit={this.props.onUnitInit}
            onUnitInit={this.unitInit}
            holdState={this.state.holdingLocation}
            expand={this.state.containers.active}
            setExpandedIndex={this.setExpandedIndex}
          />
          <UnitContainer
            title="Blocked users"
            units={this.props.units.filter(u => u.data.type === "blocked")}
            onUnitClick={this.onUnitClick}
            onInit={el => {
              this.initCont(el, true);
            }}
            onUnitInit={this.props.onUnitInit}
            holdState={this.state.holdingLocation}
            expand={this.state.containers.blocked}
            setExpandedIndex={this.setExpandedIndex}
          />
        </div>
      </div>
    );
  }
}

export default Units;
