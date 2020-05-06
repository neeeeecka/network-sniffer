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
    containers: {
      true: null,
      false: null
    },
    holdingLocation: {
      rect: new Rectangle(new Vector2(0, 0), new Vector2(0, 0)),
      uid: null,
      anchor: { x: 0, y: 0 },
      isAnim: false,
      isHolded: false
    },
    selectedUnit: { initialPos: { x: 0, y: 0 } },
    isHolding: false,
    shouldUpdate: false
  };
  onUnitClick = (uid, ev) => {
    this.setState({ isHolding: true });
    const t = 0.15;
    ev.persist();
    const timeout = setTimeout(() => {
      if (this.state.isHolding) {
        const unit = this.state.units.find(unit => unit.data.uid === uid);
        // const bcr = unit.el.getBoundingClientRect();
        this.curMousePos = new Vector2(ev.clientX, ev.clientY);
        this.lastMousePos = this.curMousePos;

        this.setState({
          holdingLocation: {
            rect: new Rectangle(
              new Vector2(0, 0),
              new Vector2(unit.el.offsetWidth, unit.el.offsetHeight)
            ),
            uid: uid,
            isHolded: true
          },
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
      const holdingLocation = this.state.holdingLocation;
      const containers = { true: false, false: false };

      this.setState(
        {
          containers: containers,
          holdingLocation: {
            rect: new Rectangle(new Vector2(0, 0), new Vector2(0, 0)),
            uid: holdingLocation.uid,
            isAnim: true
          },
          isHolding: false,
          shouldUpdate: false,
          isHolded: false
        },
        () => {
          const t = setTimeout(() => {
            this.setState({
              holdingLocation: {
                rect: new Rectangle(new Vector2(0, 0), new Vector2(0, 0)),
                uid: null,
                isAnim: false
              }
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
  update = deltaTime => {
    if (this.state.shouldUpdate) {
      const movement = this.curMousePos.subtract(this.lastMousePos);
      this.lastMousePos = this.curMousePos.clone();

      const holdState = this.state.holdingLocation;
      const newRect = holdState.rect.clone();

      newRect.xy.addTo(movement);

      const newHoldState = {
        rect: newRect,
        uid: holdState.uid,
        isHolded: true
      };

      const containers = { true: false, false: false };
      if (this.falseContainer.rect.intersectsPoint(this.curMousePos)) {
        containers[false] = true;
      }
      if (this.trueContainer.rect.intersectsPoint(this.curMousePos)) {
        containers[true] = true;
      }

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
        <Header />
        <div className="flex p-2">
          <UnitContainer
            title="Active users"
            type={false}
            units={this.state.units.filter(u => u.data.type === false)}
            onUnitClick={this.onUnitClick}
            onInit={el => {
              this.initCont(el, false);
            }}
            onUnitInit={this.unitInit}
            holdState={this.state.holdingLocation}
            expand={this.state.containers[false]}
          />
          <UnitContainer
            title="Blocked users"
            type={true}
            units={this.state.units.filter(u => u.data.type === true)}
            onUnitClick={this.onUnitClick}
            onInit={el => {
              this.initCont(el, true);
            }}
            onUnitInit={this.unitInit}
            holdState={this.state.holdingLocation}
            expand={this.state.containers[true]}
          />
        </div>
      </div>
    );
  }
}

export default Index;
