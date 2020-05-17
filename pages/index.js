import React, { Component } from "react";
import UnitContainer from "./components/unitContainer";
import Header from "./components/header";
import Rectangle from "./Rectangle";
import Vector2 from "./Vector2";
import FrameHandler from "./FrameHandler";
import Units from "./components/units";

function array_move(arr, old_index, new_index) {
  if (new_index > 0 && new_index > old_index) {
    arr.splice(new_index - 1, 0, arr.splice(old_index, 1)[0]);
  } else {
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  }
}

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
          type: "blocked"
        },
        el: undefined,
        sortIndex: 3
      }
    ]
  };
  updateUnitType = (uid, type, sortIndex) => {
    const newUnits = [...this.state.units];

    const unitsOfType = newUnits.filter(unit => unit.data.type === type);

    const selectedUnit = newUnits.find(unit => {
      return unit.data.uid === uid;
    });
    const otherUnits = newUnits.filter(
      unit => !unitsOfType.includes(unit) && unit !== selectedUnit
    );

    if (type === selectedUnit.data.type) {
      array_move(unitsOfType, unitsOfType.indexOf(selectedUnit), sortIndex);
    } else {
      unitsOfType.splice(sortIndex, 0, selectedUnit);
    }

    const combined = unitsOfType.concat(otherUnits);

    selectedUnit.data.type = type;
    selectedUnit.el = null;

    this.setState({ units: combined });
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
