import React, { Component } from "react";
import Rectangle from "../Rectangle";
import Vector2 from "../Vector2";

class Unit extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const nextHoldState = nextProps.holdState;
    const curholdState = this.props.holdState;

    const shouldAffect = nextHoldState.uid === this.props.data.uid;
    // console.log(nextHoldState);
    const isChanged = !nextHoldState.rect.xy.compareTo(curholdState.rect.xy);

    const shouldUpdate = shouldAffect && isChanged;

    return (
      JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data) ||
      shouldUpdate
    );
  }
  render() {
    const t = this.props.data.type === "active";

    const holdState = this.props.holdState;
    const xy = holdState.rect.xy.subtract(holdState.startOffset);

    const className =
      "animate-height shadow-xl children-mb-2 p-2 rounded-r cursor-pointer text-center border-l-4 bg-gray-800 select-none" +
      (t ? " border-gray-700" : " border-orange-700") +
      (holdState.isAnim ? " transform-duration-25" : " transform-duration-0") +
      (holdState.isHolded ? " z-10 absolute top-0" : " z-0 relative");
    const d = this.props.data;
    let style = { transform: "tranaslate(0, 0)" };
    if (holdState.uid === d.uid) {
      style = {
        transform: `translate(${xy.x}px, ${xy.y}px)`,
        width: holdState.isHolded ? holdState.rect.wh.x + "px" : "auto"
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

class Expander extends Component {
  state = {
    rect: new Rectangle(new Vector2(0, 0), new Vector2(650, 1))
  };
  expander = {};
  componentDidMount() {
    if (this.expander[this.props.uid]) {
      const cRect = this.expander[this.props.uid].getBoundingClientRect();
      const newRect = this.state.rect.clone();
      newRect.xy = new Vector2(cRect.left, cRect.top);
      newRect.wh = new Vector2(cRect.width, newRect.wh.y);
      this.setState({ rect: newRect });
      newRect.debug("rgba(27,182,255, 0.7)");
    }
  }
  render() {
    const shouldExpand = this.props.holdStateRect.intersects(this.state.rect);
    // const shouldExpand = this.props.holdStateRect.intersectsWithOffset(
    //   this.state.rect,
    //   this.props.startOffset
    // );

    return (
      <span
        className={"block animate-height " + (shouldExpand ? "h-16" : "h-0")}
        ref={el => {
          this.expander[this.props.uid] = el;
        }}
      />
    );
  }
}

class UnitContainer extends Component {
  getUnits = () => {
    const units = [];
    this.props.units.forEach((unit, i) => {
      units.push(
        <React.Fragment key={unit.data.uid}>
          <Unit
            index={i}
            onUnitClick={this.props.onUnitClick}
            onUnitInit={this.props.onUnitInit}
            data={unit.data}
            element={unit.el}
            holdState={this.props.holdState}
          />
          <Expander
            {...unit.data}
            {...this.props.holdState}
            holdStateRect={this.props.holdState.rect}
          />
        </React.Fragment>
      );
    });
    return units;
  };

  render() {
    const units = this.getUnits();

    return (
      <div
        className="w-1/2 m-1"
        ref={el => {
          if (el) {
            this.props.onInit(el);
          }
        }}
      >
        <span className="w-full text-gray-100 font-medium text-lg px-1 mb-1 inline-block">
          {this.props.title}
        </span>
        <div className="relative bg-gray-900 items-center text-indigo-100 rounded-md shadow-inner p-3">
          <Expander
            uid={"first"}
            {...this.props.holdState}
            holdStateRect={this.props.holdState.rect}
          />
          {units}
        </div>
      </div>
    );
  }
}

export default UnitContainer;
