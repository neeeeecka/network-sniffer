import React, { Component } from "react";
import Rectangle from "../Rectangle";
import Vector2 from "../Vector2";

class Unit extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const nextHoldState = nextProps.holdState;
    const curholdState = this.props.holdState;

    // const shouldAffect = nextHoldState.uid === this.props.data.uid;
    const shouldAffect = true;
    // console.log(nextHoldState);
    const isChanged = !nextHoldState.rect.xy.compareTo(curholdState.rect.xy);

    const shouldUpdate = shouldAffect && isChanged;

    return (
      JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data) ||
      shouldUpdate ||
      nextProps.element !== this.props.element
    );
  }
  render() {
    const holdState = this.props.holdState;
    const xy = holdState.rect.xy;
    const data = this.props.data;
    const type = data.type;

    const shouldAffect = holdState.uid === data.uid;

    const className =
      "children-mb-2 animate-height shadow-xl p-2 rounded-r cursor-pointer text-center border-l-4 bg-gray-800 select-none" +
      (type === "active" ? " border-gray-700" : " border-orange-700") +
      (holdState.isAnim && shouldAffect
        ? " transform-duration-25"
        : " transform-duration-0") +
      (holdState.isHolded && shouldAffect
        ? " z-10 absolute top-0 left-0"
        : " z-0 relative");
    let style = { transform: "tranaslate(0, 0)" };
    if (holdState.uid === data.uid) {
      style = {
        transform: `translate(${xy.x}px, ${xy.y}px)`,
        width: holdState.isHolded ? holdState.rect.wh.x + "px" : "auto"
      };
    }
    return (
      <div
        className={className}
        onMouseDown={ev => {
          this.props.onUnitClick(data.uid, ev);
        }}
        style={style}
        ref={el => {
          if (!this.props.element) {
            this.props.onUnitInit(data.uid, el);
          }
        }}
      >
        <div className="flex pl-5 text-gray-200 capitalize font-medium">
          <span className="flex-1">Unique ID</span>
          <span className="flex-1">Mac</span>
          <span className="flex-1">Description</span>
        </div>
        <div className="flex pl-5 text-indigo-100 capitalize">
          <span className="flex-1">{data.uid}</span>
          <span className="flex-1">{data.mac}</span>
          <span className="flex-1">{data.description}</span>
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
    rect: new Rectangle(new Vector2(0, 0), new Vector2(0, 0)),
    shouldExpand: false
  };
  expander = {};
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  tryInit() {
    if (this.element) {
      const cRect = this.element.getBoundingClientRect();
      const newRect = this.state.rect.clone();
      newRect.xy = new Vector2(cRect.left, cRect.top);
      newRect.wh = new Vector2(cRect.width, 35);

      console.log("mounted with: " + newRect.wh.toString());
      this.setState({ rect: newRect }, () => {
        this.state.rect.debugAt(this.debugId);
        console.log(this.debugId);
      });
    } else {
      console.log("Waiting for element");
      const t = setTimeout(() => {
        this.tryInit();
        clearTimeout(t);
      }, 250);
    }
  }

  componentDidMount() {
    // if (this.element) {
    this.tryInit();
    // }
    // console.log("mounted - expander", this.element);
  }
  // static getDerivedStateFromProps(nextProps, prevState) {}
  componentDidUpdate(prevProps, prevState) {
    if (this.props.matches) {
      this.state.rect.debugEnd(this.debugId);
      this.debugId = null;
    } else {
      const cRect = this.element.getBoundingClientRect();
      const newXY = new Vector2(cRect.left, cRect.top);
      const newRect = this.state.rect;
      newRect.xy = new Vector2(cRect.left, cRect.top);

      //if expander is moved
      if (!newRect.xy.compareTo(newXY)) {
        this.setState({ rect: newRect }, () => {});
      }

      //if draggable moved
      if (
        !this.props.holdState.rect.xy.compareTo(prevProps.holdState.rect.xy)
      ) {
        // const newShouldExpand = this.props.holdState.rect.intersects(newRect);
        const newShouldExpand = newRect.intersectsPoint(
          this.props.holdState.cursorPos
        );

        if (this.shouldExpand !== newShouldExpand) {
          this.setState({ shouldExpand: newShouldExpand }, () => {
            if (newShouldExpand) {
              this.props.setExpandedIndex(this.props.listIndex);
            }
          });
        }
      }
      if (!this.debugId) {
        // this.debugId = newRect.debug("rgba(27,182,255, 0.5)");
      }
      this.state.rect.debugAt(this.debugId);
    }
  }
  componentWillUnmount() {
    this.state.rect.debugEnd(this.debugId);
  }
  render() {
    if (typeof window !== "undefined") {
      this.state.rect.debugAt(this.debugId);
    }

    this.shouldExpand = this.state.shouldExpand;

    return this.props.matches ? null : (
      <span
        listid={this.props.listId}
        className={
          "block transform-duration-15 " +
          (this.state.shouldExpand ? "h-16" : "h-0")
        }
        ref={el => {
          this.element = el;
          // console.log("reffed - ", this.props.listId);
        }}
      />
    );
  }
}

class UnitContainer extends Component {
  getUnits = () => {
    const units = [];
    const sorted = this.props.units.sort((a, b) => {
      return a.sortIndex - b.sortIndex;
    });

    sorted.forEach((unit, i) => {
      units.push(
        <Unit
          key={unit.data.uid + "-u"}
          index={i}
          onUnitClick={this.props.onUnitClick}
          onUnitInit={this.props.onUnitInit}
          data={unit.data}
          element={unit.el}
          holdState={this.props.holdState}
        />
      );
      units.push(
        <Expander
          matches={this.props.holdState.uid === unit.data.uid}
          key={unit.data.uid + "-e"}
          listId={unit.data.uid}
          holdState={this.props.holdState}
          setExpandedIndex={this.props.setExpandedIndex}
          listIndex={i + 1}
        />
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
        <div className="bg-gray-900 items-center text-indigo-100 rounded-md shadow-inner p-3">
          <Expander
            matches={false}
            key={"first-e"}
            listId={"first"}
            holdState={this.props.holdState}
            listIndex={0}
            setExpandedIndex={() => this.props.setExpandedIndex(0)}

            // holdStateRect={this.props.holdState.rect}
          />
          {units}
        </div>
      </div>
    );
  }
}

export default UnitContainer;
