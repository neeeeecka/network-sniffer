import React, { Component } from "react";

class Unit extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const nextHolding = nextProps.holdingLocation;
    const curHolding = this.props.holdingLocation;

    const shouldAffect = nextHolding.uid === this.props.data.uid;
    const isChanged =
      nextHolding.x !== curHolding.x || nextHolding.y !== curHolding.y;

    const shouldUpdate = shouldAffect && isChanged;

    return (
      JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data) ||
      shouldUpdate
    );
  }
  render() {
    const t = this.props.type === false;
    const xy = this.props.holdingLocation;

    const className =
      "shadow-md children-mb-2 p-2 rounded-r cursor-pointer text-center border-l-4 bg-gray-700 select-none" +
      (t ? " border-gray-700" : " border-orange-700") +
      (xy.isAnim ? " transform-duration-25" : " transform-duration-0");
    const d = this.props.data;
    let style = { transform: "tranaslate(0, 0)" };
    if (xy.uid === d.uid) {
      style = {
        transform: `translate(${xy.x}px, ${xy.y}px)`
      };
    }
    return (
      <div
        className={className}
        onMouseDown={ev => {
          this.props.onUnitClick(d.uid, ev);
        }}
        style={style}
        ref={el => {
          if (!this.props.element) {
            this.props.onUnitInit(d.uid, el);
          }
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
          key={unit.data.uid}
          index={i}
          type={this.props.type}
          onUnitClick={this.props.onUnitClick}
          onUnitInit={this.props.onUnitInit}
          data={unit.data}
          element={unit.el}
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
