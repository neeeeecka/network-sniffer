import React, { Component } from "react";

class Unit extends Component {
  render() {
    const t = this.props.type === false;
    const className =
      "children-mb-2 p-2 rounded-r cursor-pointer text-center border-l-4 bg-gray-800 select-none" +
      (t ? " border-gray-700" : " border-orange-700");
    const d = this.props.data;
    console.log(this.props.holdingLocation.uid, d.uid);
    return (
      <div
        className={className}
        onMouseDown={() => {
          this.props.onUnitClick(d.uid);
        }}
      >
        <div className="flex pl-5 text-gray-200 capitalize font-medium">
          <span className="flex-1">Unique ID</span>
          <span className="flex-1">Mac</span>
          <span className="flex-1">Description</span>
        </div>
        <div className="flex pl-5 text-indigo-100 capitalize">
          <span className="flex-1">{d.uid}</span>
          <span className="flex-1">{d.mac}</span>
          <span className="flex-1">{d.description}</span>
        </div>
        <div className="flex">
          {/* <span className="w-1/4 text-indigo-200 font-medium">
              Block amount:
            </span>
            <span className="w-3/4">
                <div>

                </div>
            </span> */}
        </div>
      </div>
    );
  }
}

class UnitContainer extends Component {
  getUnits = () => {
    const units = [];
    this.props.units.forEach((unit, i) => {
      units.push(
        <Unit
          key={unit.uid}
          index={i}
          type={this.props.type}
          onUnitClick={this.props.onUnitClick}
          data={unit}
          holdingLocation={this.props.holdingLocation}
        />
      );
    });
    return units;
  };
  render() {
    return (
      <div className="w-1/2 m-1">
        <span className="w-full text-gray-100 font-medium text-lg px-1 mb-1 inline-block">
          {this.props.title}
        </span>
        <div className="bg-gray-900 items-center text-indigo-100 rounded-md shadow-inner p-3">
          {this.getUnits()}
        </div>
      </div>
    );
  }
}

export default UnitContainer;
