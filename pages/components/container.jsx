import React, { Component } from "react";

class Unit extends Component {
  render() {
    const t = this.props.type === false;
    const className =
      "p-2 rounded-r cursor-pointer text-center border-l-4 bg-gray-800" +
      (t ? " border-gray-700" : " border-orange-700");
    return (
      <div className={className}>
        <div className="flex pl-5 text-gray-200 capitalize font-medium ">
          <span className="flex-1">Unique ID</span>
          <span className="flex-1">Mac</span>
          <span className="flex-1">Description</span>
        </div>
        <div className="flex pl-5 text-indigo-100 capitalize">
          <span className="flex-1">5eb1581730e03169f0c3e720</span>
          <span className="flex-1">5f4-123f-323f-32</span>
          <span className="flex-1">windows 10 pc</span>
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

class Container extends Component {
  render() {
    return (
      <div className="w-1/2 m-1">
        <span className="w-full text-gray-100 font-medium text-lg px-1 mb-1 inline-block">
          {this.props.title}
        </span>
        <div className="bg-gray-900 items-center text-indigo-100 rounded-md shadow-inner p-5">
          <Unit type={this.props.type} />
        </div>
      </div>
    );
  }
}

export default Container;
