import React, { Component } from "react";
import UnitContainer from "./components/unitContainer";
import Header from "./components/header";
import Rectangle from "./Rectangle";
import Vector2 from "./Vector2";
import FrameHandler from "./FrameHandler";
import Units from "./components/units";

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
        el: undefined,
        sortIndex: 0
      },
      {
        data: {
          uid: "5eb1581730e03167f0c3e921",
          mac: "123-123f-53f-32",
          description: "mac osX pc",
          type: "active"
        },
        el: undefined,
        sortIndex: 1
      },
      {
        data: {
          uid: "32133730e03fsdf",
          mac: "555-78f-53f-923",
          description: "Android",
          type: "active"
        },
        el: undefined,
        sortIndex: 2
      },
      {
        data: {
          uid: "321355f",
          mac: "555-78f-53f-923",
          description: "Bundroid",
          type: "active"
        },
        el: undefined,
        sortIndex: 3
      }
    ]
  };
  updateUnitType = (uid, type, sortIndex) => {
    const newUnits = [...this.state.units].sort((a, b) => {
      return a.sortIndex - b.sortIndex;
    });

    let prevSortIndex = newUnits[sortIndex - 1]
      ? newUnits[sortIndex - 1].sortIndex
      : 0;
    //move all next indices by 1 to avoid conflict
    newUnits.forEach(unit => {
      if (unit.data.type === type) {
        if (unit.sortIndex >= sortIndex) {
          unit.sortIndex++;
          // if (unit.sortIndex > lastLargestSortIndex) {
          //   lastLargestSortIndex = unit.sortIndex;
          // }
        }
      }
    });

    const selectedUnit = newUnits.find(unit => {
      return unit.data.uid === uid;
    });
    //set index of moved unit
    selectedUnit.data.type = type;
    selectedUnit.sortIndex = sortIndex;
    selectedUnit.el = null;

    this.setState({ units: newUnits });
  };
  onUnitInit = (uid, el) => {
    const newUnits = [...this.state.units];
    const found = newUnits.find(unit => unit.data.uid === uid);
    found.el = el;
    this.setState({ units: newUnits });
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
        <Units
          units={this.state.units}
          updateUnitType={this.updateUnitType}
          onUnitInit={this.onUnitInit}
        />
      </div>
    );
  }
}

export default Index;
