import React, { Component } from "react";

class Header extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  render() {
    return (
      <div className="p-3 bg-gray-900 shadow-inner">
        <span className="text-gray-400 font-medium">
          Simple JS network sniffer
        </span>
      </div>
    );
  }
}

export default Header;
