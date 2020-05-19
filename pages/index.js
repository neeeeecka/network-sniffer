import React, { Component } from "react";
import Header from "./components/header";
import Units from "./components/units";

function array_move(arr, old_index, new_index) {
  if (new_index > 0 && new_index > old_index) {
    arr.splice(new_index - 1, 0, arr.splice(old_index, 1)[0]);
  } else {
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  }
}

const cURL = "http://localhost:2999";

class Index extends Component {
  state = {
    units: [
      // {
      //   data: {
      //     _id: "3244ff730e03169f0c3e720",
      //     mac: "5f4-123f-323f-32",
      //     description: "windows 10 pc",
      //     type: "active"
      //   },
      //   el: undefined,
      //   sortIndex: 0
      // }
    ]
  };
  updateUnitType = async (_id, type, sortIndex) => {
    const newUnits = [...this.state.units];

    const changes = { type: type };
    const result = await this.fetchEditUnit(_id, changes);
    if (!result.error) {
      const unitsOfType = newUnits.filter(unit => unit.data.type === type);

      const selectedUnit = newUnits.find(unit => {
        return unit.data._id === _id;
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
    }
  };
  onUnitInit = (_id, el) => {
    const newUnits = [...this.state.units];
    const found = newUnits.find(unit => unit.data._id === _id);
    found.el = el;
    this.setState({ units: newUnits });
  };

  fetchUnits = async () => {
    let response = await fetch(`${cURL}/units`, {
      method: "GET"
    });
    let data = await response.json();
    const units = [];
    data.forEach(unit => {
      units.push({ data: unit, el: undefined });
    });
    this.setState({ units: units });
  };
  fetchEditUnit = async (_id, changes) => {
    let response = await fetch(`${cURL}/units/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(changes)
    });
    let data = await response.json();
    return data;
  };

  componentDidMount = async () => {
    this.fetchUnits();
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
